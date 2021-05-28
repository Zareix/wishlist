<script>
  import { onMount } from "svelte"
  import { scale, fade } from "svelte/transition"
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

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  if (currentUser == null) navigate("/login", { replace: true })

  let categories = []
  let choosenUser
  let allUsers = []
  let snackbar
  let snackbarText

  onMount(async () => {
    allUsers = [currentUser.email]
    choosenUser = currentUser.email

    await db
      .collection("categories")
      .get()
      .then((d) => {
        d.forEach((cat) => (categories = [...categories, cat.id]))
      })

    await db
      .collection("permissions")
      .where("canWatch", "array-contains", currentUser.email)
      .get()
      .then((d) => {
        d.docs.forEach((u) => {
          allUsers = [...allUsers, u.id]
        })
      })
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
  <div class="separator" />
  <div id="wishlist">
    {#each categories as c}
      <List
        category={c}
        choosenUser={choosenUser !== undefined
          ? choosenUser
          : currentUser.email}
        {snackbarOpen}
      />
    {/each}
  </div>
  <Snackbar bind:this={snackbar} id="snackbarHome">
    <Label>{snackbarText}</Label>
    <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
  </Snackbar>
</main>

<style>
  .separator {
    width: 40vw;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  @media (max-width: 768px) {
    .separator {
      width: 60vw;
    }
  }

  .fab {
    position: fixed;
    z-index: 2;
    bottom: 15px;
    right: 15px;
  }
</style>
