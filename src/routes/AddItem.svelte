<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import { db9 } from '../firebase';
  import { user } from '../stores.js';

  import Loading from '../components/Loading.svelte';
  import NewCatPopup from '../components/NewCatPopup.svelte';
  import LinkInputList from '../components/LinksInputList.svelte';
  import Layout from '../components/Layout.svelte';
  import { getCategories } from '../utils/firebase-utils';
  import type { Item as ItemModel } from '../models/Item';

  import itemNotFoundSvg from '../assets/item-not-found.svg';

  import Select, { Option } from '@smui/select';
  import Button from '@smui/button';
  import { Content } from '@smui/card';
  import Textfield from '@smui/textfield';
  import { navigate } from 'svelte-routing';
  import IconButton from '@smui/icon-button';
  import Snackbar, { Actions, Label as LabelSnack } from '@smui/snackbar';
  import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
  } from '@firebase/firestore';
  import type { User } from 'firebase/auth';

  let currentUser: User;
  const unsubscribe = user.subscribe((v) => (currentUser = v));

  export let modifId: string = undefined;
  export let oldCategory = '';

  export let location;
  const urlParams = new URLSearchParams(location.search);

  let error = false;
  let title = '';
  let loading = false;
  let description = '';
  let price = 0;
  let category = '';
  let categories: string[] = [];
  let refs: RefImg[] = [];
  let images: RefImg[] = [];
  let createdAt: Date;
  let snackbar: Snackbar;
  let snackbarText: string;
  let inputErrors = {
    title: false,
    category: false,
  };
  let newCatPopupOpen: boolean;

  type RefImg = { value: string; id: number };

  onDestroy(() => unsubscribe());

  onMount(async () => {
    if (urlParams.has('title')) title = urlParams.get('title');
    if (urlParams.has('ref')) addRef(urlParams.get('ref'));
    if (urlParams.has('body')) {
      let body = urlParams.get('body');
      if (
        refs.length === 0 &&
        (body.includes('http://') || body.includes('https://'))
      ) {
        description = body.split('http')[0];
        addRef('http' + body.split('http')[1]);
      } else description = body;
    }

    categories = await getCategories(currentUser.email);

    if (modifId) {
      await getDoc<ItemModel>(
        doc(db9, currentUser.email, 'items', oldCategory, modifId)
      )
        .then((i) => {
          let data = i.data();
          category = oldCategory;
          title = data.title;
          data.references.forEach((r) => addRef(r));
          data.images.forEach((i) => addImg(i));
          createdAt = data.createdAt;
          description = data.description ? data.description : '';
          price = data.price ? data.price : 0;
        })
        .catch((e) => (error = true));
    }
  });

  const addItem = async (e) => {
    e.preventDefault();

    inputErrors = { title: false, category: false };
    snackbar.close();
    snackbarText = '';

    if (category === undefined || category.trim() === '') {
      inputErrors.category = true;
      snackbarText = 'Merci de choisir une catégorie';
    }
    if (title === undefined || title.trim() === '') {
      inputErrors.title = true;
      snackbarText = 'Merci de choisir un titre';
    }

    if (snackbarText !== '') {
      snackbar.open();
      return;
    }

    loading = true;

    if (modifId) {
      if (oldCategory !== category) {
        await deleteDoc(
          doc(db9, currentUser.email, 'items', oldCategory, modifId)
        );
        await addDoc(collection(db9, currentUser.email, 'items', category), {
          title,
          description,
          price,
          createdAt,
          position: 0,
          references: refs.filter((r) => r.value !== '').map((r) => r.value),
          images: images.filter((i) => i.value !== '').map((i) => i.value),
        });
        back();
      } else {
        updateDoc(doc(db9, currentUser.email, 'items', category, modifId), {
          title,
          description,
          price,
          references: refs.filter((r) => r.value !== '').map((r) => r.value),
          images: images.filter((i) => i.value !== '').map((i) => i.value),
        }).then(() => back());
      }
    } else {
      addDoc(collection(db9, currentUser.email, 'items', category), {
        position: 0,
        title,
        description,
        price,
        createdAt: Date.now(),
        references: refs.filter((r) => r.value !== '').map((r) => r.value),
        images: images.filter((i) => i.value !== '').map((i) => i.value),
      }).then(() => back());
    }
  };

  const back = () =>
    navigate(
      '/#category' +
        category.charAt(0).toUpperCase() +
        category.slice(1).replace(' ', '')
    );

  const addNewRef = () =>
    (refs = [...refs, { id: Math.floor(Math.random() * 100000), value: '' }]);
  const addRef = (ref: string) =>
    (refs = [...refs, { id: Math.floor(Math.random() * 100000), value: ref }]);
  const removeRef = (ref: RefImg) => (refs = refs.filter((r) => r !== ref));

  const addNewImg = () =>
    (images = [
      ...images,
      { id: Math.floor(Math.random() * 100000), value: '' },
    ]);
  const addImg = (img: string) =>
    (images = [
      ...images,
      { id: Math.floor(Math.random() * 100000), value: img },
    ]);
  const removeImg = (img: RefImg) => (images = images.filter((i) => i !== img));

  const switchTitleDesc = () => ([title, description] = [description, title]);

  const toggleNewCat = async () => {
    newCatPopupOpen = !newCatPopupOpen;
    if (!newCatPopupOpen) {
      const res = await getDoc(doc(db9, currentUser.email, 'categories'));
      if (res.exists) categories = res.data().categories;
    }
  };
</script>

<Layout active="add" pageTitle="Ajouter">
  <main id="addItem">
    {#if loading}
      <Loading />
    {:else if error}
      <div class="error">
        <img src={itemNotFoundSvg} alt="item not found" />
        <h2>Oups, impossible de trouver cet objet</h2>
      </div>
    {:else}
      <section id="addCard" class="card">
        <Content>
          <h1>Ajouter un objet</h1>
          <form on:submit={addItem}>
            <div class="flex">
              <Select
                bind:value={category}
                label={categories.length === 0
                  ? 'Aucune catégorie'
                  : 'Catégorie'}
                bind:invalid={inputErrors.category}
                disabled={categories.length === 0}
              >
                {#each categories as cat}
                  <Option value={cat}>{cat.toUpperCase()}</Option>
                {/each}
              </Select>

              <IconButton
                class="material-icons"
                type="button"
                on:click={toggleNewCat}>add</IconButton
              >
            </div>

            <div class="spacer" />

            <Textfield
              label="Titre"
              bind:value={title}
              bind:invalid={inputErrors.title}
              placeholder="Title"
            />

            {#if urlParams.has('title') && description !== ''}
              <IconButton
                class="material-icons swap-icon"
                type="button"
                on:click={switchTitleDesc}>swap_horiz</IconButton
              >
            {:else}
              <br />
              <div class="spacer" />
            {/if}

            <Textfield label="Description/Remarques" bind:value={description} />

            <br />
            <div class="spacer" />

            <Textfield
              label="Prix"
              bind:value={price}
              type="number"
              input$min="0.00"
              input$max="1000000.00"
              input$step="0.01"
            >
              <svelte:fragment slot="trailingIcon">€</svelte:fragment>
            </Textfield>

            <br />
            <div class="spacer" />

            <LinkInputList
              bind:links={refs}
              addNewLink={addNewRef}
              removeLink={removeRef}
              placeholder="Référence"
              title="Références"
            />
            <br />
            <div class="spacer" />

            <LinkInputList
              bind:links={images}
              addNewLink={addNewImg}
              removeLink={removeImg}
              placeholder="Image"
              title="Images"
              showThumbnail
            />
            <br />
            <div class="spacer" />

            <div class="flex center">
              <Button variant="raised" type="submit" class="add-button">
                {#if modifId}Mettre à jour{:else}Ajouter{/if}
              </Button>
            </div>
          </form>
        </Content>
      </section>
    {/if}
    <Snackbar
      bind:this={snackbar}
      class="snackbar-warning-container"
      id="snackbarAddItem"
    >
      <LabelSnack>{snackbarText}</LabelSnack>
      <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
      </Actions>
    </Snackbar>
    <NewCatPopup
      toggleDialog={toggleNewCat}
      allCategories={categories}
      open={newCatPopupOpen}
    />
  </main>
</Layout>

<style>
  h1 {
    text-align: center;
    margin-bottom: 1em;
  }

  :global(.swap-icon) {
    transform: rotate(90deg);
    padding-right: 6px;
  }

  :global(.snackbar-warning-container > .mdc-snackbar__surface) {
    background-color: #b00020;
  }

  .flex {
    align-items: center;
  }

  .error {
    width: 20vw;
    margin: 2em auto;
    text-align: center;
  }

  :global(.smui-text-field--standard),
  :global(.mdc-select) {
    width: 70%;
  }

  :global(.mdc-text-field__input) {
    user-select: text;
  }

  @media (max-width: 768px) {
    .error {
      width: 60vw;
    }

    :global(.smui-text-field--standard),
    :global(.mdc-select) {
      width: 85%;
    }
  }
</style>
