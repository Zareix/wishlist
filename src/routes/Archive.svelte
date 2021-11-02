<script>
  import { onMount } from "svelte"
  import { db9 } from "../firebase"
  import { user } from "../stores"

  import Snackbar, { Actions, Label as LabelSnack } from "@smui/snackbar"
  import IconButton from "@smui/icon-button"
  import Radio from "@smui/radio"
  import FormField from "@smui/form-field"
  import Button from "@smui/button"

  import Loading from "../components/Loading.svelte"
  import Item from "../components/Item.svelte"
  import NoContent from "../components/NoContent.svelte"
  import Layout from "../components/Layout.svelte"
  import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
  } from "@firebase/firestore"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  let loading = true
  let items = []
  let selectedType = "all"
  let itemsToShow = 10

  let snackbar
  let snackbarText = ""

  $: filteredItems = loading
    ? []
    : filterItems(items, selectedType, itemsToShow)

  onMount(() => {
    loading = true

    getDocs(
      query(
        collection(db9, currentUser.email, "items", "_archive"),
        orderBy("createdAt", "desc")
      )
    ).then((data) => {
      data.forEach((i) => addItems({ id: i.id, ...i.data() }))
      loading = false
    })
  })

  const addItems = (i) => (items = [...items, i])

  const filterItems = (items, type, toShow) => {
    switch (type) {
      case "all":
        return items.slice(0, toShow)
      case "validated":
        return items.slice(0, toShow).filter((i) => i.validated)
      case "notValidated":
        return items.slice(0, toShow).filter((i) => !i.validated)
      default:
        return items.slice(0, toShow)
    }
  }

  const addCategory = async (categories, newCategory) => {
    await setDoc(doc(db9, currentUser.email, "categories"), {
      categories: [...categories, newCategory.trim().toLowerCase()],
    })
  }

  const restoreItem = async (item) => {
    let categories = []
    const res = getDoc(doc(db9, currentUser.email, "categories"))
    if (res.exists) categories = res.data().categories
    else {
      const res2 = await getDocs(collection(db9, "categories"))
      res2.forEach((cat) => (categories = [...categories, cat.id]))
    }

    if (
      !categories.some(
        (c) => c.trim().toLowerCase() === item.categorie.trim().toLowerCase()
      )
    )
      await addCategory(categories, item.categorie)

    setDoc(doc(db9, currentUser.email, "items", item.categorie, item.id), {
      ...item,
      validated: false,
    }).then(() => {
      snackbarText = `Item '${item.title}' restauré dans '${item.categorie}'`
      snackbar.open()
      deleteItem(item)
    })
  }

  const deleteItem = (item) => {
    deleteDoc(doc(db9, currentUser.email, "items", "_archive", item.id)).then(
      () => {
        items = items.filter((i) => i !== item)
        if (!snackbarText.includes("restauré")) {
          snackbarText = 'Item "' + item.title + '" supprimé'
          snackbar.open()
        }
      }
    )
  }

  const showMore = () => {
    if (itemsToShow + 10 > items.length) itemsToShow = items.length
    else itemsToShow += 10
  }
</script>

<Layout active="archive">
  <main id="archive">
    <h1>Archive</h1>
    {#if loading}
      <Loading />
    {:else if items.length === 0}
      <NoContent
        subtitle="Les objets supprimés ou validés apparaîtront ici !"
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
          <Item
            {index}
            {item}
            {restoreItem}
            permanentDeleteItem={deleteItem}
            category={item.categorie}
          />
        {/each}
        <NoContent title="Aucun objet de ce type" />
      </ul>
      {#if itemsToShow < items.length}
        <Button
          on:click={showMore}
          type="button"
          variant="raised"
          class="show-more">Voir plus</Button
        >
      {/if}
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

  :global(button.show-more) {
    margin: 1.5rem auto;
    display: block;
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
