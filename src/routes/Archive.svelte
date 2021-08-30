<script>
  import { onMount } from "svelte"
  import { db } from "../firebase"
  import { user } from "../stores"

  import Snackbar, { Actions, Label as LabelSnack } from "@smui/snackbar"
  import IconButton from "@smui/icon-button"
  import Radio from "@smui/radio"
  import FormField from "@smui/form-field"

  import TopBar from "../components/Layout.svelte"
  import Loading from "../components/Loading.svelte"
  import Item from "../components/Item.svelte"
  import NoContent from "../components/NoContent.svelte"
  import Footer from "../components/Footer.svelte"
  import Layout from "../components/Layout.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  let loading = true
  let items = []
  let selectedType = "all"

  let snackbar
  let snackbarText = ""

  $: filteredItems = loading ? [] : filterItems(items, selectedType)

  onMount(() => {
    loading = true

    db.collection(currentUser.email)
      .doc("items")
      .collection("_archive")
      .orderBy("createdAt", "desc")
      .get()
      .then((data) => {
        data.forEach((i) => addItems({ id: i.id, ...i.data() }))
        loading = false
      })
  })

  const addItems = (i) => {
    items = [...items, i]
  }

  const filterItems = (items, type) => {
    switch (type) {
      case "all":
        return items
      case "validated":
        return items.filter((i) => i.validated)
      case "notValidated":
        return items.filter((i) => !i.validated)
      default:
        return items
    }
  }

  const restoreItem = (item) => {
    db.collection(currentUser.email)
      .doc("items")
      .collection(item.categorie)
      .doc(item.id)
      .set({
        ...item,
        validated: false,
      })
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

<Layout active="archive">
  <main id="archive">
    <h1>Archive</h1>
    {#if loading}
      <Loading />
    {:else if items.length === 0}
      <NoContent
        subtitle="Les objets supprimés ou validés apparaitront ici !"
      />
    {:else}
      <section id="selectType">
        <FormField>
          <Radio bind:group={selectedType} value={"all"} />
          <span slot="label">
            {"Tous les objets"}
          </span>
        </FormField>

        <FormField>
          <Radio bind:group={selectedType} value={"validated"} />
          <span slot="label">
            {"Validés seulement"}
          </span>
        </FormField>

        <FormField>
          <Radio bind:group={selectedType} value={"notValidated"} />
          <span slot="label">
            {"Non validés seulement"}
          </span>
        </FormField>
      </section>
      <ul class="item-list">
        {#each filteredItems as item, index}
          <Item {index} {item} {restoreItem} permanentDeleteItem={deleteItem} />
        {/each}
        <NoContent title="Aucun objet de ce type" />
      </ul>
    {/if}
    <Snackbar bind:this={snackbar} id="snackbarArchive">
      <LabelSnack>{snackbarText}</LabelSnack>
      <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
      </Actions>
    </Snackbar>
  </main>
</Layout>

<style>
  h1 {
    text-align: center;
  }

  ul {
    list-style: none;
  }

  .item-list {
    width: 60%;
    max-width: 600px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  #selectType {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  #selectType > :global(*) {
    margin: 0 0.5em;
  }

  #archive > ul > :global(#noContent:not(:only-child)) {
    display: none;
  }

  #archive > ul > :global(#noContent:only-child) {
    width: 50%;
    margin: auto;
  }

  @media (max-width: 768px) {
    .item-list {
      width: 80%;
    }

    #archive > ul > :global(#noContent:only-child) {
      width: 80%;
    }
  }
</style>
