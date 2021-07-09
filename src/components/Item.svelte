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
  export let index = 0

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  const formatRef = (ref) => {
    ref = ref.replace(new RegExp("(http)(s)?(://)(www\\.)?(m\\.)?"), "")
    if (ref.indexOf("/") >= 0) return ref.slice(0, ref.indexOf("/"))
    return ref
  }

  const moveToArchive = async (validated) => {
    await db
      .collection(currentUser.email)
      .doc("items")
      .collection("_archive")
      .doc(item.id)
      .set({
        ...item,
        validated,
      })

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

<li id={"item" + index}>
  <Card padded variant="outlined">
    <div class={"item-header"}>
      {#if restoreItem && item.validated}
        <div class="material-icons green-icon-button check">check</div>
      {/if}
      {#if restoreItem && !item.validated}
        <div class="material-icons red-icon-button check">close</div>
      {/if}
      <div class="flex-grow">
        <h3 class="title">
          {item.title}
        </h3>
        {#if item.description && item.description !== ""}
          <p class="description text-gray">{item.description}</p>
        {/if}
      </div>
      {#if item.price && item.price !== 0}
        <p class="price text-gray">{item.price.toLocaleString()} €</p>
      {/if}
    </div>
    <Content>
      {#if item.references.length > 0}
        <Set chips={item.references} let:chip class="chips-set">
          {#if chip.startsWith("http")}
            <a
              href={chip}
              target="_blank"
              rel="noopener noreferrer"
              class="chip-link"
            >
              <Chip {chip}><Text>{formatRef(chip)}</Text></Chip>
            </a>
          {:else}
            <Chip {chip}><Text>{formatRef(chip)}</Text></Chip>
          {/if}
        </Set>
      {/if}
      {#if item.images.length > 0}
        <div class="flex image-list">
          {#each item.images as image, index}
            <ItemImage title={item.title} {image} {index} />
          {/each}
        </div>
      {/if}
    </Content>
    {#if restoreItem}
      <ActionIcons>
        <Wrapper>
          <IconButton
            on:click={() => restoreItem(item)}
            class="material-icons restore">restore_from_trash</IconButton
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
            <IconButton class="material-icons edit-icon-button">edit</IconButton
            >
          </Link>
          <Tooltip>Modifier</Tooltip>
        </Wrapper>
        <Wrapper>
          <IconButton
            on:click={() => moveToArchive(true)}
            class="material-icons green-icon-button">check</IconButton
          >
          <Tooltip>Valider</Tooltip>
        </Wrapper>
        <Wrapper>
          <IconButton
            on:click={() => moveToArchive(false)}
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

  h3 {
    font-weight: 500;
  }

  .item-header {
    margin: 0.5rem 1rem;
    margin-bottom: 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--gray-light);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .description {
    margin: 0;
    margin-top: 0.25em;
    font-weight: 500;
  }

  .flex-grow {
    flex-grow: 1;
  }

  .check {
    align-self: center;
    justify-self: center;
    font-size: 2em;
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

  @media (prefers-color-scheme: dark) {
    .price,
    .description,
    :global(.restore) {
      color: var(--gray-light);
    }
  }
</style>
