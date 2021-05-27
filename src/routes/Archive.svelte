<script>
  import { onMount } from "svelte"
  import { db } from "../firebase"
  import { user } from "../stores"

  import Snackbar, { Actions, Label as LabelSnack } from "@smui/snackbar"
  import IconButton from "@smui/icon-button"

  import TopBar from "../components/TopBar.svelte"
  import Loading from "../components/Loading.svelte"
  import Item from "../components/Item.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  let loading = true
  let items = []

  let snackbar
  let snackbarText = ""

  onMount(() => {
    loading = true

    db.collection(currentUser.email)
      .doc("items")
      .collection("_archive")
      .get()
      .then((data) => {
        data.forEach((i) => addItems({ id: i.id, ...i.data() }))
        loading = false
      })
  })

  const addItems = (i) => {
    items = [...items, i]
  }

  const restoreItem = (item) => {
    db.collection(currentUser.email)
      .doc("items")
      .collection(item.categorie)
      .doc(item.id)
      .set(item)
      .then(() => {
        snackbarText = 'Item "' + item.title + '" restauré'
        snackbar.open()
        deleteItem(item)
      })
  }

  const deleteItem = (item) => {
    db.collection(currentUser.email)
      .doc("items")
      .collection("_archive")
      .doc(item.id)
      .delete()
      .then(() => {
        items = items.filter((i) => i !== item)
        if (!snackbarText.includes("restauré")) {
          snackbarText = 'Item "' + item.title + '" supprimé'
          snackbar.open()
        }
      })
  }
</script>

<TopBar />
<main>
  <h1>Archive</h1>

  <section id="archive">
    {#if loading}
      <Loading />
    {:else if items.length === 0}
      <p>Aucun item archivé</p>
    {:else}
      {#each items as item}
        <ul>
          <Item {item} {restoreItem} permanentDeleteItem={deleteItem} />
        </ul>
      {/each}
    {/if}
  </section>
  <Snackbar bind:this={snackbar} id="snackbarArchive">
    <LabelSnack>{snackbarText}</LabelSnack>
    <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
  </Snackbar>
</main>

<style>
  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
  }

  p {
    text-align: center;
  }
</style>
