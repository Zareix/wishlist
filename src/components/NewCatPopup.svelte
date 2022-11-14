<script lang="ts">
  import { onDestroy } from "svelte"

  import Dialog, { Content, Actions } from "@smui/dialog"
  import Button, { Label } from "@smui/button"
  import Textfield from "@smui/textfield"
  import { doc, setDoc } from "@firebase/firestore"

  import { db9 } from "../firebase"
  import { user } from "../stores"

  let currentUser
  const unsubscribe = user.subscribe((v) => (currentUser = v))

  export let toggleDialog
  export let allCategories
  export let open

  let category = ""
  let error = ""

  onDestroy(() => unsubscribe())

  const closeDialog = () => {
    category = ""
    error = ""
    toggleDialog()
  }

  const checkErrors = () => {
    if (category.trim() === "") {
      error = "Merci d'entrer l'intitulé de la catégorie"
      return true
    }
    if (!category.match(/^[a-zA-Z][a-zA-Z0-9- ]+[a-zA-Z0-9]$/)) {
      error =
        "La catégorie ne doit contenir que des chiffres, lettres, espaces et/ou charactères '-'"
      return true
    }
    if (
      allCategories.some(
        (c) => category.trim().toLowerCase() === c.trim().toLowerCase()
      )
    ) {
      error = "Cette catégorie existe déjà !"
      return true
    }
    return false
  }

  const addNewCat = (e) => {
    e.preventDefault()

    if (checkErrors()) return

    setDoc(doc(db9, currentUser.email, "categories"), {
      categories: [...allCategories, category.trim().toLowerCase()],
    }).then(() => closeDialog())
  }
</script>

<Dialog bind:open>
  <h2>Ajouté une catégorie</h2>
  <Content>
    <form on:submit={addNewCat}>
      <Textfield
        label="Intitulé"
        bind:value={category}
        on:focus={() => (error = "")}
        on:blur{checkErrors}
      />
      {#if error !== ""}
        <p class="error">{error}</p>
      {/if}
      <Button type="submit">
        <Label>Ajouter</Label>
      </Button>
    </form>
  </Content>
  <Actions>
    <Button on:click={closeDialog} type="button">
      <Label>Fermer</Label>
    </Button>
  </Actions>
</Dialog>

<style>
  h2 {
    margin: 0.75em 1em;
  }

  .error {
    margin-top: 0.5rem;
    color: var(--red);
  }
</style>
