<script>
  import { onDestroy, onMount } from "svelte"

  import { db9 } from "../firebase"
  import { user } from "../stores"

  import Select, { Option } from "@smui/select"
  import Snackbar, { Actions, Label } from "@smui/snackbar"
  import IconButton from "@smui/icon-button"
  import { navigate } from "svelte-routing"
  import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
  } from "@firebase/firestore"

  import List from "../components/List.svelte"
  import NoContent from "../components/NoContent.svelte"
  import Loading from "../components/Loading.svelte"
  import Layout from "../components/Layout.svelte"

  let currentUser
  const unsubscribe = user.subscribe((v) => (currentUser = v))

  let categories = []
  let chosenUser
  let allUsers = []
  let authorizedCat = {}
  let snackbar
  let snackbarText
  let loading = true

  $: displayCategories =
    chosenUser === currentUser.email ? categories : authorizedCat[chosenUser]

  onDestroy(() => unsubscribe())

  onMount(async () => {
    allUsers = [currentUser.email]
    chosenUser = currentUser.email

    const res = await getDoc(doc(db9, currentUser.email, "categories"))
    if (res.exists()) categories = res.data().categories
    else categories = []

    const res2 = await getDocs(
      query(
        collection(db9, "permissions"),
        where("canWatch", "array-contains", currentUser.email)
      )
    )
    res2.docs.forEach((u) => {
      allUsers = [...allUsers, u.id]
      authorizedCat[u.id] = u.data().authorizedCat
      authorizedCat[u.id].sort()
    })

    categories = categories.sort((a, b) => {
      a = a.toLowerCase()
      b = b.toLowerCase()
      if (a < b) return -1
      if (a > b) return 1
      return 0
    })
    loading = false
  })

  const snackbarOpen = (message) => {
    snackbarText = message
    snackbar.open()
  }
</script>

<Layout active="home" pageTitle={currentUser.displayName}>
  <main id="home">
    {#if loading}
      <div class="loading-container">
        <Loading />
      </div>
    {:else}
      <div id="selectWishlistSection" class="flex center">
        <Select
          bind:value={chosenUser}
          label="Wishlist de"
          variant="filled"
          id="selectWishlist"
        >
          {#each allUsers as email}
            <Option value={email}
              >{email === currentUser.email ? "Moi" : email}</Option
            >
          {/each}
        </Select>
      </div>
      <hr />
      <div id="wishlist">
        {#each displayCategories as c}
          <List
            category={c}
            chosenUser={chosenUser !== undefined
              ? chosenUser
              : currentUser.email}
            {snackbarOpen}
            orderByPosition
          />
        {/each}
        <NoContent
          subtitle={currentUser.email === chosenUser
            ? "Ajoutez des objets à l'aide du bouton + en bas à droite !"
            : "Cet utilisateur n'a encore rien ajouté dans sa wishlist"}
        />
      </div>
      <Snackbar bind:this={snackbar} id="snackbarHome">
        <Label>{snackbarText}</Label>
        <Actions>
          <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
      </Snackbar>
    {/if}
  </main>
</Layout>

<style>
  .loading-container {
    height: 80vh;
  }

  hr {
    width: 40vw;
    margin-top: 1rem;
  }

  :global(#selectWishlist) {
    width: auto;
  }

  #wishlist {
    margin: 0 auto;
    width: clamp(280px, 100%, 768px);
  }

  #wishlist > :global(#noContent:not(:only-child)) {
    display: none;
  }

  #wishlist > :global(#noContent:only-child) {
    margin: 2rem auto;
  }

  @media (max-width: 768px) {
    hr {
      width: 60vw;
    }
  }
</style>
