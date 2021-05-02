<script>
  import { onMount } from "svelte"
  import { scale, fade } from "svelte/transition"
  import { cubicIn } from "svelte/easing"

  import { db } from "./firebase"
  import { user } from "./stores"

  import Fab, { Icon } from "@smui/fab"
  import Tooltip, { Wrapper } from "@smui/tooltip"
  import Select, { Option } from "@smui/select"
  import Snackbar, { Actions, Label } from "@smui/snackbar"
  import IconButton from "@smui/icon-button"

  import AddItem from "./AddItem.svelte"
  import List from "./List.svelte"
  import TopBar from "./TopBar.svelte"
  import Config from "./Config.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  let isAdd = false
  let isModif = false
  let isConfig = false
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

  const back = () => {
    isAdd = false
    isModif = false
    isConfig = false
  }

  let item
  const modif = (i) => {
    isModif = true
    item = i
  }

  const goToConfig = () => {
    isConfig = true
  }

  const snackbarOpen = (message) => {
    snackbarText = message
    snackbar.open()
  }
</script>

<svelte:head>
  <title>Wishlist - {currentUser.displayName}</title>
</svelte:head>

<div>
  <TopBar {back} {goToConfig} />
  <main transition:fade={{ easing: cubicIn }}>
    {#if isAdd}
      <AddItem {back} {snackbarOpen} />
    {:else if isModif}
      <AddItem {back} itemModif={item} {snackbarOpen} />
    {:else if isConfig}
      <Config {back} />
    {:else}
      <div id="fab-add" class="fab" transition:scale={{ easing: cubicIn }}>
        <Wrapper>
          <Fab
            color="primary"
            on:click={() => (isAdd = !isAdd)}
            class="green-button"
          >
            <Icon class="material-icons">add</Icon>
          </Fab>
          <Tooltip>Ajouter un item</Tooltip>
        </Wrapper>
      </div>
      <div id="select-wishlist-section" class="flex center">
        <Select
          bind:value={choosenUser}
          label="Wishlist de"
          variant="filled"
          id="select-wishlist"
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
            {modif}
            choosenUser={choosenUser !== undefined
              ? choosenUser
              : currentUser.email}
            {snackbarOpen}
          />
        {/each}
      </div>
    {/if}
    <Snackbar bind:this={snackbar}>
      <Label>{snackbarText}</Label>
      <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
      </Actions>
    </Snackbar>
  </main>
</div>

<style>
  main {
    padding-bottom: 5rem;
    position: relative;
    top: 5rem;
  }

  .separator{
    width: 40vw;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  @media (max-width : 768px){
    .separator{
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
