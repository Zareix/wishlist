<script>
  import { db } from "./firebase"
  import { user } from "./stores"

  import Card, { Content, ActionIcons } from "@smui/card"
  import IconButton from "@smui/icon-button"
  import Tooltip, { Wrapper } from "@smui/tooltip"

  import ItemImage from "./ItemImage.svelte"

  export let item
  export let modif
  export let removeItem

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  const formatRef = (ref) => {
    if (ref.startsWith("https://")) ref = ref.substring(8)
    if (ref.startsWith("http://")) ref = ref.substring(7)

    return ref.slice(0, ref.indexOf("/"))
  }

  const deleteItem = () => {
    db.collection(currentUser.email)
      .doc("items")
      .collection(item.categorie)
      .doc(item.id)
      .delete()
      .then(() => {
        removeItem(item)
      })
  }
</script>

<li>
  <Card padded variant="outlined">
    <Content>
      <h3>
        {item.title}
      </h3>
      <div class="separator" />
      <div class="flex image-list">
        {#each item.images as image, index}
          <ItemImage {image} {index} />
        {/each}
      </div>
      {#if item.references.length === 0}
        <div />
      {:else}
        <h4>Références :</h4>
        <ul>
          {#each item.references as ref, i}
            <li>
              <a href={ref}>{formatRef(ref)}</a>
            </li>
          {/each}
        </ul>
      {/if}
    </Content>
    <ActionIcons>
      <Wrapper>
        <IconButton on:click={() => modif(item)} class="material-icons"
          >edit</IconButton
        >
        <Tooltip>Modifier</Tooltip>
      </Wrapper>
      <Wrapper>
        <IconButton on:click={deleteItem} class="material-icons red-icon-button"
          >delete</IconButton
        >
        <Tooltip>Supprimer</Tooltip>
      </Wrapper>
    </ActionIcons>
  </Card>
</li>

<style>
  li {
    margin: 0 1.5em;
    padding-bottom: 0.5em;
  }

  h3 {
    margin-bottom: 1em;
  }

  h4 {
    margin: 0.5em;
    margin-top: 1em;
  }

  ul {
    padding-left: 1em;
  }

  .image-list {
    width: 100%;
    flex-wrap: wrap;
    gap: 0.5em 1em;
    align-items: center;
    align-content: center;
  }

  a {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
