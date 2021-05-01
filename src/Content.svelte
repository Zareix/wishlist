<script>
  import { onMount } from "svelte"
  import { scale, fade } from "svelte/transition"
  import { cubicIn } from "svelte/easing"

  import { db } from "./firebase"
  import { user } from "./stores"

  import Button from "@smui/button"
  import Fab, { Icon } from "@smui/fab"

  import AddItem from "./AddItem.svelte"
  import List from "./List.svelte"
  import TopBar from "./TopBar.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  let isAdd = false
  let isModif = false
  let categories = []

  onMount(async () => {
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
  <title>Wishlist - {currentUser.displayName}</title>
</svelte:head>

<div>
  <TopBar {back} />
  <section transition:fade={{ easing: cubicIn }}>
    {#if isAdd}
      <AddItem {back} />
    {:else if isModif}
      <AddItem {back} itemModif={item} />
    {:else}
      <div>
        <div class="fab" transition:scale={{ easing: cubicIn }}>
          <Fab
            color="primary"
            on:click={() => (isAdd = !isAdd)}
            class="green-button"
          >
            <Icon class="material-icons">add</Icon>
          </Fab>
        </div>
        {#each categories as c}
          <div class=" flex center">
            <div class="list">
              <List category={c} {modif} />
            </div>
          </div>
        {/each}
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
    z-index: 2;
    bottom: 15px;
    right: 15px;
  }

  .list {
    width: 80vw;
    margin: 1rem;
  }

  @media (max-width: 768px) {
    .list {
      width: 90vw;
    }
  }
</style>
