<script lang="ts">
  import { onDestroy } from 'svelte';

  import { Link } from 'svelte-routing';
  import { deleteDoc, doc, setDoc } from '@firebase/firestore';
  import { ActionIcons } from '@smui/card';
  import IconButton from '@smui/icon-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import Chip, { Set, Text } from '@smui/chips';
  import type { User } from 'firebase/auth';

  import { db9 } from '../firebase';
  import { user } from '../stores';

  import type { Item as ModelItem } from '../models/Item';
  import ItemImageList from './ItemImageList.svelte';

  export let item: ModelItem;
  export let removeItem: (item: ModelItem) => void;
  export let canModif: boolean;
  export let restoreItem: (item: ModelItem) => void;
  export let permanentDeleteItem: (item: ModelItem) => void;
  export let index = 0;
  export let category = '';

  let currentUser: User;
  const unsubscribe = user.subscribe((v) => (currentUser = v));

  onDestroy(() => unsubscribe());

  const formatRef = (ref: string) => {
    ref = ref.replace(new RegExp('(http)(s)?(://)(www\\.)?(m\\.)?'), '');
    if (ref.indexOf('/') >= 0) return ref.slice(0, ref.indexOf('/'));
    return ref;
  };

  const moveToArchive = async (validated: boolean) => {
    await setDoc(doc(db9, currentUser.email, 'items', '_archive', item.id), {
      ...item,
      validated,
    });

    deleteDoc(
      doc(db9, currentUser.email, 'items', item.categorie, item.id)
    ).then(() => {
      removeItem(item);
    });
  };
</script>

<article id={category.replaceAll(' ', '') + '_item' + index} class="item">
  <div class="content-wrapper">
    <div class="content">
      <div class="item-header">
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
          {#if item.description && item.description !== ''}
            <p class="description text-gray">{item.description}</p>
          {/if}
        </div>
      </div>
      {#if item.references.length > 0}
        <Set chips={item.references} let:chip class="chips-set">
          {#if chip.startsWith('http')}
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
    </div>
    {#if item.images.length > 0}
      <div class="image-list">
        <ItemImageList images={item.images} title={item.title} />
      </div>
    {/if}
  </div>
  <ActionIcons>
    {#if item.price && item.price !== 0}
      <p class="price text-gray">{item.price.toLocaleString()} €</p>
    {/if}
    {#if restoreItem}
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
    {:else if canModif}
      <Wrapper>
        <Link to={'/item/' + item.categorie + '/' + item.id}>
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
    {/if}
  </ActionIcons>
</article>

<style>
  .content-wrapper {
    margin-top: 1.25rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .content {
    grid-column: span 2 / span 2;
    margin-inline: 0.5rem;
  }

  .content:only-child {
    grid-column: span 3 / span 3;
  }

  .item {
    padding: 0.5rem;
    background-color: var(--background-secondary);
    border-radius: 16px;
    cursor: default;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    transition: box-shadow 250ms ease;
  }

  .item:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .title {
    cursor: text;
    font-weight: 500;
  }

  .item-header {
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
    margin-left: 2rem;
    width: 100%;
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
    align-items: center;
    align-content: center;
  }

  .item-deleted-from {
    width: 100%;
    font-size: 0.8rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: right;
    color: var(--text-color);
  }

  .item-deleted-from .category-name {
    text-transform: capitalize;
    font-style: italic;
  }

  :global(.mdc-card__action-icons) {
    min-height: 3rem;
  }

  :global(.mdc-chip-set .mdc-chip) {
    margin: 0;
  }

  :global(.mdc-card__action-icons .mdc-icon-button) {
    z-index: 0;
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
