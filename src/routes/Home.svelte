<script>
  import { onMount } from "svelte"

  import { db } from "../firebase"
  import { user } from "../stores"

  import Select, { Option } from "@smui/select"
  import Snackbar, { Actions, Label } from "@smui/snackbar"
  import IconButton from "@smui/icon-button"
  import { navigate } from "svelte-routing"

  import List from "../components/List.svelte"
  import NoContent from "../components/NoContent.svelte"
  import Loading from "../components/Loading.svelte"
  import Layout from "../components/Layout.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  if (currentUser == null) navigate("/login", { replace: true })

  let categories = []
  let choosenUser
  let allUsers = []
  let authorizedCat = {}
  let snackbar
  let snackbarText
  let loading = true

  $: displayCategories =
    choosenUser === currentUser.email ? categories : authorizedCat[choosenUser]

  onMount(async () => {
    allUsers = [currentUser.email]
    choosenUser = currentUser.email

    const res = await db.collection(currentUser.email).doc("categories").get()
    if (res.exists) categories = res.data().categories
    else
      await db
        .collection("categories")
        .get()
        .then((data) =>
          data.forEach((cat) => (categories = [...categories, cat.id]))
        )

    const res2 = await db
      .collection("permissions")
      .where("canWatch", "array-contains", currentUser.email)
      .get()
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

<svelte:head>
  <title>Wishlist - {currentUser.displayName}</title>
</svelte:head>

<Layout active="home">
  <main id="home">
    {#if loading}
      <div class="loading-container">
        <Loading />
      </div>
    {:else}
      <div id="selectWishlistSection" class="flex center">
        <Select
          bind:value={choosenUser}
          label="Wishlist de"
          variant="filled"
          id="selectWishlist"
        >
          {#each allUsers as email}
            <Option value={email}>{email}</Option>
          {/each}
        </Select>
      </div>
      <hr />
      <div id="wishlist">
        {#each displayCategories as c}
          <List
            category={c}
            choosenUser={choosenUser !== undefined
              ? choosenUser
              : currentUser.email}
            {snackbarOpen}
            orderByPosition
          />
        {/each}
        <NoContent
          subtitle={currentUser.email === choosenUser
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
    width: 30%;
    margin: 2rem auto;
  }

  @media (max-width: 768px) {
    #wishlist > :global(#noContent:only-child) {
      width: 70%;
    }

    hr {
      width: 60vw;
    }
  }
</style>
