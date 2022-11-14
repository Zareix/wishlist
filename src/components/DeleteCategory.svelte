<script lang="ts">
  import { onDestroy } from 'svelte';

  import { db9 } from '../firebase';
  import { user } from '../stores';

  import Tooltip, { Wrapper } from '@smui/tooltip';
  import IconButton from '@smui/icon-button';
  import Dialog, { Content, Actions, InitialFocus } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import {
    collection,
    doc,
    getDocs,
    updateDoc,
    writeBatch,
  } from '@firebase/firestore';

  let currentUser;
  const unsubscribe = user.subscribe((v) => (currentUser = v));

  export let categories = [];
  let selectedCat = '';
  let prompt = false;

  onDestroy(() => unsubscribe());

  const promptDeleteCat = (cat) => {
    prompt = true;
    selectedCat = cat.name;
  };

  const cancel = () => {
    prompt = false;
    selectedCat = '';
  };

  const deleteCat = async () => {
    const snap = await getDocs(
      collection(db9, currentUser.email, 'items', selectedCat)
    );

    if (snap.size !== 0) {
      const batch = writeBatch(db9);
      snap.docs.forEach((document) => {
        batch.set(
          doc(db9, currentUser.email, 'items', '_archive', document.id),
          {
            ...document.data(),
            categorie: selectedCat,
            validated: false,
          }
        );

        batch.delete(
          doc(db9, currentUser.email, 'items', selectedCat, document.id)
        );
      });
      await batch.commit();
    }

    updateDoc(doc(db9, currentUser.email, 'categories'), {
      categories: categories
        .filter((c) => c.name !== selectedCat)
        .map((c) => c.name),
    }).then(() => {
      selectedCat = '';
      location.reload();
    });
  };
</script>

<section>
  <h1>Supprimer des catégories</h1>
  {#if categories.length > 0}
    <ul class="list">
      {#each categories as cat}
        <li class="list-item">
          <Wrapper>
            <IconButton
              on:click={() => promptDeleteCat(cat)}
              class="material-icons red-icon-button">delete</IconButton
            >
            <Tooltip>Supprimer la catégorie</Tooltip>
          </Wrapper>
          {cat.name}
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">Aucune catégorie</p>
  {/if}

  <Dialog bind:open={prompt}>
    <h2 class="dialog-title">Supprimer {selectedCat}</h2>
    <Content>
      <p>
        Voulez vous vraiment supprimer la catégorie <span
          class="dialog-category-name">"{selectedCat}"</span
        > ?
      </p>
      <p>Tout le contenu sera déplacé vers les archives</p>
    </Content>
    <Actions>
      <Button on:click={deleteCat} type="button" class="dialog-delete-button">
        <Label>Supprimer</Label>
      </Button>
      <Button
        on:click={cancel}
        type="button"
        defaultAction
        use={[InitialFocus]}
      >
        <Label>Annuler</Label>
      </Button>
    </Actions>
  </Dialog>
</section>

<style>
  h1 {
    text-align: center;
  }

  p {
    color: var(--text-color);
  }

  .empty {
    margin-left: 0.75rem;
    font-style: italic;
  }

  .list {
    margin: 0 1rem;
    list-style: none;
  }

  .list-item {
    position: relative;
    display: flex;
    align-items: center;
    text-transform: capitalize;
  }

  .list-item:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 85%;
    height: 1px;
    background-color: rgba(0 0 0 / 30%);
  }

  .dialog-title {
    margin: 0.75em 1em;
  }

  .dialog-category-name {
    font-weight: 600;
    text-transform: capitalize;
  }

  :global(.dialog-delete-button
      .mdc-button__ripple::before, .dialog-delete-button
      .mdc-button__ripple::after) {
    background-color: var(--red);
  }

  :global(.dialog-delete-button .mdc-button__label) {
    color: var(--red);
  }

  @media (prefers-color-scheme: dark) {
    .list-item:not(:last-child)::after {
      background-color: rgba(255 255 255 / 30%);
    }
  }
</style>
