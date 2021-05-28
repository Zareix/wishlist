<script>
  import { onMount } from "svelte"
  import { db } from "../firebase"
  import { user } from "../stores"

  import Card, { Content } from "@smui/card"

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
    snackbarOpen('"' + item.title + '" supprimé')
  }

  const categoryToID = () => {
    let c = category.replace(" ", "")
    return "category" + c.charAt(0).toUpperCase() + c.slice(1)
  }
</script>

{#if items.length !== 0}
  <div id={categoryToID()} class="flex center">
    <div class="list">
      <Card padded>
        <Content>
          <h2>{category}</h2>
          <ul>
            {#each items as item, index}
              <Item {index} {item} {removeItem} {canModif} />
            {/each}
          </ul>
        </Content>
      </Card>
    </div>
  </div>
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
