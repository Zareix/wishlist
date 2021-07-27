<script>
  import { onMount } from "svelte"
  import { scale } from "svelte/transition"
  import { cubicIn } from "svelte/easing"

  import { db } from "../firebase"
  import { user } from "../stores"

  import Fab, { Icon } from "@smui/fab"
  import Tooltip, { Wrapper } from "@smui/tooltip"
  import Select, { Option } from "@smui/select"
  import Snackbar, { Actions, Label } from "@smui/snackbar"
  import IconButton from "@smui/icon-button"
  import { Link, navigate } from "svelte-routing"

  import List from "../components/List.svelte"
  import TopBar from "../components/TopBar.svelte"
  import NoContent from "../components/NoContent.svelte"
  import Loading from "../components/Loading.svelte"
  import Footer from "../components/Footer.svelte"

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

<TopBar />
<div id="fabAdd" class="fab" transition:scale={{ easing: cubicIn }}>
  <Wrapper>
    <Link to="/add">
      <Fab color="primary" class="green-button">
        <Icon class="material-icons">add</Icon>
      </Fab>
    </Link>
    <Tooltip>Ajouter un item</Tooltip>
  </Wrapper>
</div>
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
      {#each categories as c}
        {#if choosenUser === currentUser.email || authorizedCat[choosenUser].includes(c)}
          <List
            category={c}
            choosenUser={choosenUser !== undefined
              ? choosenUser
              : currentUser.email}
            {snackbarOpen}
            orderByPosition
          />
        {/if}
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
<Footer />

<style>
  .loading-container {
    height: 80vh;
  }

  .fab {
    position: fixed;
    z-index: 20;
    bottom: 15px;
    right: 15px;
  }

  hr {
    width: 40vw;
    margin-top: 1rem;
  }

  :global(#selectWishlist) {
    width: auto;
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
