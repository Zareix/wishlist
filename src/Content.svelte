<script>
  import { onMount } from "svelte"
  import { scale, fade } from "svelte/transition"
  import { cubicIn } from "svelte/easing"

  import { db } from "./firebase"

  import Button from "@smui/button"
  import Fab, { Icon } from "@smui/fab"
  
  import AddItem from "./AddItem.svelte"
  import List from "./List.svelte"
  import TopBar from "./TopBar.svelte"

  export let user

  let isAdd = false
  let isModif = false
  let fab = false
  let categories = []

  onMount(async () => {
    window.addEventListener("scroll", (e) => {
      if (!fab && window.pageYOffset > 100) {
        fab = true
      } else if (fab && window.pageYOffset <= 100) {
        fab = false
      }
    })

    await db
      .collection("categories")
      .get()
      .then((d) => {
        d.forEach((cat) => (categories = [...categories, cat.id]))
      })
  })

  const back = () => {
    isAdd = false
    isModif = false
  }

  let item
  const modif = (i) => {
    isModif = true
    item = i
  }
</script>

<svelte:head>
  <title>Wishlist - {user.displayName}</title>
</svelte:head>

<div>
  <header>
    <TopBar {user} {back} />
  </header>
  <section transition:fade={{ easing: cubicIn }}>
    {#if isAdd}
      <AddItem {back} {user} />
    {:else if isModif}
      <AddItem {back} itemModif={item} {user} />
    {:else}
      <div>
        <div class="flex center">
          <Button
            variant="raised"
            on:click={() => (isAdd = !isAdd)}
            class="green-button"
          >
            Ajouter un objet
          </Button>
        </div>
        {#each categories as c}
          <div class="list">
            <List {user} category={c} {modif} />
          </div>
        {/each}
        {#if fab}
          <div class="fab" transition:scale={{ easing: cubicIn }}>
            <Fab
              color="primary"
              on:click={() => (isAdd = !isAdd)}
              class="green-button"
            >
              <Icon class="material-icons">add</Icon>
            </Fab>
          </div>
        {/if}
      </div>
    {/if}
  </section>
</div>

<style>
  section {
    padding-bottom: 5rem;
    position: relative;
    top: 5rem;
  }

  .fab {
    position: fixed;
    z-index: 20;
    bottom: 15px;
    right: 15px;
  }

  .list {
    margin: 1rem;
  }
</style>
