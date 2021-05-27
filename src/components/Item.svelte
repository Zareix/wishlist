<script>
  import { db } from "../firebase"
  import { user } from "../stores"

  import Card, { Content, ActionIcons } from "@smui/card"
  import IconButton from "@smui/icon-button"
  import Tooltip, { Wrapper } from "@smui/tooltip"
  import Chip, { Set, Text } from "@smui/chips"

  import ItemImage from "./ItemImage.svelte"
  import { Link } from "svelte-routing"

  export let item = undefined
  export let removeItem = undefined
  export let canModif = undefined
  export let restoreItem = undefined
  export let permanentDeleteItem = undefined

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  const formatRef = (ref) => {
    ref = ref.replace(new RegExp("(http)(s)?(://)(www\\.)?(m\\.)?"), "")
    if (ref.indexOf("/") >= 0) return ref.slice(0, ref.indexOf("/"))
    return ref
  }

  const deleteItem = async () => {
    await db
      .collection(currentUser.email)
      .doc("items")
      .collection("_archive")
      .doc(item.id)
      .set(item)

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
      {#if item.description && item.description !== ""}
        <p>{item.description}</p>
      {/if}
      <div class="separator" />
      <div class="flex image-list">
        {#each item.images as image, index}
          <ItemImage {image} {index} />
        {/each}
      </div>
      {#if item.references.length === 0}
        <div />
      {:else}
        <Set chips={item.references} let:chip>
          <a href={chip} target="_blank" rel="noopener noreferrer">
            <Chip {chip}><Text>{formatRef(chip)}</Text></Chip>
          </a>
        </Set>
      {/if}
    </Content>
    {#if restoreItem}
      <ActionIcons>
        <Wrapper>
          <IconButton on:click={() => restoreItem(item)} class="material-icons"
            >restore_from_trash</IconButton
          >
          <Tooltip>Restaurer</Tooltip>
        </Wrapper>
        <Wrapper>
          <IconButton
            on:click={() => permanentDeleteItem(item)}
            class="material-icons red-icon-button">delete</IconButton
          >
          <Tooltip>Supprimer définitivement</Tooltip>
        </Wrapper>
      </ActionIcons>
    {:else if canModif}
      <ActionIcons>
        <Wrapper>
          <Link to={"/item/" + item.categorie + "/" + item.id}>
            <IconButton class="material-icons">edit</IconButton>
          </Link>
          <Tooltip>Modifier</Tooltip>
        </Wrapper>
        <Wrapper>
          <IconButton
            on:click={deleteItem}
            class="material-icons red-icon-button">delete</IconButton
          >
          <Tooltip>Supprimer</Tooltip>
        </Wrapper>
      </ActionIcons>
    {/if}
  </Card>
</li>

<style>
  li {
    margin: 0 1.5em;
    padding-bottom: 0.5em;
  }

  p {
    margin: 0;
    margin-top: 0.5em;
  }

  .image-list {
    width: 100%;
    flex-wrap: wrap;
    gap: 0.5em 1em;
    margin-bottom: 0.25em;
    align-items: center;
    align-content: center;
  }

  @media (max-width: 768px) {
    .image-list {
      justify-content: center;
    }
  }

  a {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
