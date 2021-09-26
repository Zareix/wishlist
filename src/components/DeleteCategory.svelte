<script>
  import { onMount } from "svelte"

  import { db } from "../firebase"
  import { user } from "../stores"

  import Tooltip from "@smui/tooltip/Tooltip.svelte"
  import IconButton from "@smui/icon-button"
  import Wrapper from "@smui/tooltip/Wrapper.svelte"
  import Dialog, { Content, Actions, InitialFocus } from "@smui/dialog"
  import Button, { Label } from "@smui/button"

  let currentUser
  const unsubcribe = user.subscribe((v) => (currentUser = v))

  export let categories = []
  let selectedCat = ""
  let prompt = false

  const promptDeleteCat = (cat) => {
    prompt = true
    selectedCat = cat.name
  }

  const cancel = () => {
    prompt = false
    selectedCat = ""
  }

  const deleteCat = async () => {
    const defCat = [
      "art toys",
      "clothing",
      "divers",
      "maison",
      "Pour chez Lola",
      "Pour Lola",
      "tech",
      "test1",
      "test2",
    ]

    const snapshot = await db
      .collection(currentUser.email)
      .doc("items")
      .collection(selectedCat)
      .get()

    // Delete collection
    if (snapshot.size !== 0) {
      const batch = db.batch()
      snapshot.docs.forEach((doc) => {
        //Move to archive
        const ref = db
          .collection(currentUser.email)
          .doc("items")
          .collection("_archive")
          .doc(doc.id)
        batch.set(ref, {
          ...doc.data(),
          validated: false,
        })

        batch.delete(doc.ref) // Delete from category so delete collection
      })
      await batch.commit()
    }

    db.collection(currentUser.email) // Update user categories list
      .doc("categories")
      .update({
        categories: categories
          .filter((c) => c.name !== selectedCat)
          .map((c) => c.name),
      })
      .then(() => {
        selectedCat = ""
        location.reload()
      })
  }
</script>

<section>
  <h1>Supprimer des catégories</h1>
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
    content: "";
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
