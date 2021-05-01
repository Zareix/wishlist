<script>
  import { onMount } from "svelte"
  import { db } from "./firebase"
  import { user } from "./stores"
  import Card, { Content } from "@smui/card"

  import Item from "./Item.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  export let category
  export let modif

  let items = []

  const addItems = (i) => {
    items = [...items, i]
  }

  onMount(async () => {
    await db
      .collection(currentUser.email)
      .doc("items")
      .collection(category)
      .orderBy("createdAt")
      .get()
      .then((data) =>
        data.forEach((i) =>
          addItems({ id: i.id, categorie: category, ...i.data() })
        )
      )
  })
</script>

{#if items.length === 0}
  <div />
{:else}
  <Card padded>
    <Content>
      <h2>{category}</h2>
      <ul>
        {#each items as item}
          <Item {item} {modif} />
        {/each}
      </ul>
    </Content>
  </Card>
{/if}

<style>
  ul {
    list-style: none;
  }

  h2 {
    text-transform: capitalize;
  }
</style>
