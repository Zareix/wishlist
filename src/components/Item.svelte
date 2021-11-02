<script>
  import { db9 } from "../firebase"
  import { user } from "../stores"

  import { ActionIcons } from "@smui/card"
  import IconButton from "@smui/icon-button"
  import Tooltip, { Wrapper } from "@smui/tooltip"
  import Chip, { Set, Text } from "@smui/chips"

  import ItemImage from "./ItemImage.svelte"
  import { Link } from "svelte-routing"
  import { deleteDoc, doc, setDoc } from "@firebase/firestore"

  export let item = undefined
  export let removeItem = undefined
  export let canModif = undefined
  export let restoreItem = undefined
  export let permanentDeleteItem = undefined
  export let index = 0
  export let category = ""

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  const formatRef = (ref) => {
    ref = ref.replace(new RegExp("(http)(s)?(://)(www\\.)?(m\\.)?"), "")
    if (ref.indexOf("/") >= 0) return ref.slice(0, ref.indexOf("/"))
    return ref
  }

  const moveToArchive = async (validated) => {
    await setDoc(doc(db9, currentUser.email, "items", "_archive", item.id), {
      ...item,
      validated,
    })

    deleteDoc(
      doc(db9, currentUser.email, "items", item.categorie, item.id)
    ).then(() => {
      removeItem(item)
    })
  }
</script>

<li id={category.replace(" ", "") + "Item" + index} class="item">
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
  {#if item.references.length > 0 || item.images.length > 0}
    <section class="item-content">
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
        <div class="image-list">
          {#each item.images as image, index}
            <ItemImage title={item.title} {image} {index} />
          {/each}
        </div>
      {/if}
    </section>
  {/if}
  {#if restoreItem}
    <ActionIcons>
      <p class="item-deleted-from">
        Supprimé de <span class="category-name">"{category}"</span>
      </p>
      <Wrapper>
        <IconButton
          on:click={() => restoreItem(item)}
          class="material-icons restore">restore_from_trash</IconButton
        >
        <Tooltip
          >Restaurer dans <span class="capitalize">"{category}"</span></Tooltip
        >
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
          <IconButton class="material-icons edit-icon-button">edit</IconButton>
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
</li>

<style>
  .item {
    padding: 0.5rem;
    background-color: var(--background-secondary);
    border-radius: 16px;
    cursor: default;
  }

  .title {
    cursor: text;
    font-weight: 500;
  }

  .item-header {
    margin: 1rem;
    margin-bottom: 0;
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .item-content {
    margin: 0 1rem;
    border-top: 1px solid var(--gray-light);
  }

  .description {
    margin: 0;
    margin-top: 0.25em;
    font-weight: 500;
    cursor: text;
  }

  .flex-grow {
    flex-grow: 1;
  }

  .price {
    margin: 0;
    cursor: text;
    white-space: nowrap;
  }

  .check {
    align-self: center;
    justify-self: center;
    font-size: 2em;
  }

  .image-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em 1em;
    margin-bottom: 0.25em;
    align-items: center;
    align-content: center;
  }

  .item-deleted-from {
    width: 100%;
    margin-left: 1rem;
    font-size: 0.8rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--text-color);
  }

  .item-deleted-from .category-name {
    text-transform: capitalize;
    font-style: italic;
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
