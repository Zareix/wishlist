<script>
  import { onMount } from "svelte"
  import { db } from "../firebase"
  import { user } from "../stores"

  import Item from "./Item.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  export let category
  export let choosenUser
  export let snackbarOpen

  let oldUser
  let items = []

  onMount(() => {
    oldUser = choosenUser
  })

  $: if (oldUser !== choosenUser) {
    fetchData()
    oldUser = choosenUser
  }

  $: canModif = currentUser.email === choosenUser

  const fetchData = async () => {
    items = []
    await db
      .collection(choosenUser)
      .doc("items")
      .collection(category)
      .orderBy("createdAt")
      .get()
      .then((data) =>
        data.forEach((i) =>
          addItems({ id: i.id, categorie: category, ...i.data() })
        )
      )
  }

  const addItems = (i) => {
    items = [...items, i]
  }

  const removeItem = (item) => {
    items = items.filter((i) => i !== item)
    snackbarOpen('"' + item.title + '" placé dans les archives')
  }

  const categoryToID = () => {
    let c = category.replace(" ", "")
    return "category" + c.charAt(0).toUpperCase() + c.slice(1)
  }
</script>

{#if items.length !== 0}
  <section id={categoryToID()} class="flex center">
    <div class="list">
      <h2>{category}</h2>
      <div class="separator separator--title" />
      <ul>
        {#each items as item, index}
          <Item {index} {item} {removeItem} {canModif} />
        {/each}
      </ul>
    </div>
  </section>
{/if}

<style>
  ul {
    list-style: none;
  }

  h2 {
    text-transform: capitalize;
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
