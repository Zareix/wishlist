<script>
  import { onMount } from "svelte"
  import { db } from "./firebase"
  import { user } from "./stores"

  import Card, { Content } from "@smui/card"
  import Snackbar, { Actions, Label } from "@smui/snackbar"
  import IconButton from "@smui/icon-button"

  import Item from "./Item.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  export let category
  export let modif

  let snackbar
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

  const removeItem = (item) => {
    items = items.filter((i) => i !== item)
    snackbar.open()
  }
</script>

{#if items.length === 0}
  <div />
{:else}
  <div class="flex center">
    <div class="list">
      <Card padded>
        <Content>
          <h2>{category}</h2>
          <ul>
            {#each items as item}
              <Item {item} {modif} {removeItem} />
            {/each}
          </ul>
          <Snackbar bind:this={snackbar}>
            <Label>Item supprimé</Label>
            <Actions>
              <IconButton class="material-icons" title="Dismiss"
                >close</IconButton
              >
            </Actions>
          </Snackbar>
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
