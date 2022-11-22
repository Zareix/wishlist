<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { db9 } from '../firebase';
  import { user } from '../stores';
  import { getCategories } from '../utils/firebase-utils';

  import Select, { Option } from '@smui/select';
  import Snackbar, { Actions, Label } from '@smui/snackbar';
  import IconButton from '@smui/icon-button';
  import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
  } from '@firebase/firestore';
  import type { User } from '@firebase/auth';

  import List from '../components/List.svelte';
  import NoContent from '../components/NoContent.svelte';
  import Loading from '../components/Loading.svelte';
  import Layout from '../components/Layout.svelte';

  let currentUser: User;
  const unsubscribe = user.subscribe((v) => (currentUser = v));

  let categories: string[] = [];
  let chosenUser: string | null;
  let allUsers: string[] = [];
  let authorizedCat = {};
  let userAuthorizedCat: string[] = [];
  let snackbar: Snackbar;
  let snackbarText: string | null;
  let loading = true;

  $: displayCategories = (
    chosenUser === currentUser.email ? categories : authorizedCat[chosenUser]
  ) as string[];

  onDestroy(() => unsubscribe());

  onMount(async () => {
    allUsers = [currentUser.email];
    chosenUser = currentUser.email;

    categories = await getCategories(currentUser.email);

    const res2 = await getDocs(
      query(
        collection(db9, 'permissions'),
        where('canWatch', 'array-contains', currentUser.email)
      )
    );
    res2.docs.forEach((u) => {
      allUsers = [...allUsers, u.id];
      authorizedCat[u.id] = u.data().authorizedCat;
      authorizedCat[u.id].sort();
    });

    const res3 = await getDoc(doc(db9, 'permissions', currentUser.email));
    userAuthorizedCat = res3.data().authorizedCat;

    let email = new URLSearchParams(window.location.search).get('email');
    chosenUser = email && allUsers.includes(email) ? email : currentUser.email;

    loading = false;
  });

  const snackbarOpen = (message: string) => {
    snackbarText = message;
    snackbar.open();
  };
</script>

<Layout active="home" pageTitle={currentUser.displayName}>
  <main id="home">
    {#if loading}
      <div class="loading-container">
        <Loading />
      </div>
    {:else}
      <div id="selectWishlistSection" class="flex center">
        <Select
          bind:value={chosenUser}
          label="Wishlist de"
          variant="filled"
          id="selectWishlist"
        >
          {#each allUsers as email}
            <Option value={email}
              >{email === currentUser.email
                ? `Moi (${currentUser.email})`
                : email}</Option
            >
          {/each}
        </Select>
      </div>
      <div id="wishlist">
        {#each displayCategories as c}
          <List
            category={c}
            {chosenUser}
            {snackbarOpen}
            orderByPosition
            hidden={chosenUser === currentUser.email &&
              !userAuthorizedCat.some(
                (x) => x.toLowerCase() === c.toLowerCase()
              )}
          />
        {/each}
        <NoContent
          subtitle={currentUser.email === chosenUser
            ? "Ajoutez des objets à l'aide du bouton + en bas à droite !"
            : "Cet utilisateur n'a encore rien ajouté dans sa wishlist"}
        />
      </div>
      <Snackbar bind:this={snackbar} id="snackbarHome">
        <Label>{snackbarText}</Label>
        <Actions>
          <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
      </Snackbar>
    {/if}
  </main>
</Layout>

<style>
  .loading-container {
    height: 80vh;
  }

  :global(#selectWishlist) {
    width: auto;
  }

  #wishlist {
    margin: 0 auto;
    width: clamp(280px, 100%, 768px);
  }

  #wishlist > :global(#noContent:not(:only-child)) {
    display: none;
  }

  #wishlist > :global(#noContent:only-child) {
    margin: 2rem auto;
  }
</style>
