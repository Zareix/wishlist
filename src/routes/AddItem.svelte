<script>
  import { onMount } from "svelte"

  import { db } from "../firebase"
  import { user } from "../stores.js"

  import Loading from "../components/Loading.svelte"
  import TopBar from "../components/TopBar.svelte"
  import BackButton from "../components/BackButton.svelte"
  import Footer from "../components/Footer.svelte"

  import itemNotFoundSvg from "../assets/item-not-found.svg"

  import Select, { Option } from "@smui/select"
  import Button, { Label, Icon } from "@smui/button"
  import Card, { Content } from "@smui/card"
  import Textfield from "@smui/textfield"
  import { navigate } from "svelte-routing"
  import IconButton from "@smui/icon-button"
  import Snackbar, { Actions, Label as LabelSnack } from "@smui/snackbar"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  export let modifId = undefined
  export let oldCategorie

  export let location
  const urlParams = new URLSearchParams(location.search)

  let error = false
  let title = ""
  let loading = false
  let description = ""
  let price = 0
  let categorie = ""
  let categories = []
  let refs = []
  let images = []
  let createdAt
  let snackbar
  let snackbarText
  let inputErrors = {
    title: false,
    categorie: false,
  }

  onMount(async () => {
    if (urlParams.has("title")) title = urlParams.get("title")
    if (urlParams.has("ref")) refs[0] = urlParams.get("ref")
    if (urlParams.has("body")) {
      let body = urlParams.get("body")
      if (
        refs.length === 0 &&
        (body.includes("http://") || body.includes("https://"))
      )
        refs[0] = "http" + body.split("http")[1]
      else description = body
    }

    await db
      .collection("categories")
      .get()
      .then((cat) => {
        cat.docs.forEach((d) => (categories = [...categories, d.id]))
      })

    if (modifId) {
      await db
        .collection(currentUser.email)
        .doc("items")
        .collection(oldCategorie)
        .doc(modifId)
        .get()
        .then((i) => {
          let data = i.data()
          categorie = oldCategorie
          title = data.title
          refs = data.references
          images = data.images
          createdAt = data.createdAt
          description = data.description ? data.description : ""
          price = data.price ? data.price : 0
        })
        .catch((e) => (error = true))
    }
  })

  const addItem = (e) => {
    e.preventDefault()

    inputErrors = [false, false]
    snackbar.close()
    snackbarText = ""

    if (categorie === undefined || categorie.trim() === "") {
      inputErrors.categorie = true
      snackbarText = "Merci de choisir une catégorie"
    }
    if (title === undefined || title.trim() === "") {
      inputErrors.title = true
      snackbarText = "Merci de choisir un titre"
    }

    if (snackbarText !== "") {
      snackbar.open()
      return
    }

    loading = true

    if (modifId) {
      if (oldCategorie !== categorie) {
        db.collection(currentUser.email)
          .doc("items")
          .collection(oldCategorie)
          .doc(modifId)
          .delete()
          .then(() => {
            return db
              .collection(currentUser.email)
              .doc("items")
              .collection(categorie)
              .add({
                title,
                description,
                price,
                createdAt,
                references: refs.filter((r) => r !== ""),
                images: images.filter((i) => i !== ""),
              })
          })
          .then(() => back())
      } else {
        db.collection(currentUser.email)
          .doc("items")
          .collection(categorie)
          .doc(modifId)
          .update({
            title,
            description,
            price,
            references: refs.filter((r) => r !== ""),
            images: images.filter((i) => i !== ""),
          })
          .then(() => back())
      }
    } else {
      db.collection(currentUser.email)
        .doc("items")
        .collection(categorie)
        .add({
          title,
          description,
          price,
          createdAt: Date.now(),
          references: refs.filter((r) => r !== ""),
          images: images.filter((i) => i !== ""),
        })
        .then(() => back())
    }
  }

  const back = () => {
    navigate("/")
  }

  const addRef = () => {
    refs = [...refs, ""]
  }

  const removeRef = (ref) => {
    refs = refs.filter((r) => r !== ref)
  }

  const addImage = () => {
    images = [...images, ""]
  }

  const removeImg = (img) => {
    images = images.filter((i) => i !== img)
  }
</script>

<TopBar />
<main id="addItem">
  {#if loading}
    <Loading />
  {:else}
    <BackButton />
    {#if error}
      <div class="error">
        {@html itemNotFoundSvg}
        <h2>Oups, impossible de trouver cet objet</h2>
      </div>
    {:else}
      <Card padded id="addCard">
        <Content>
          <h1>Ajouter un objet</h1>
          <form on:submit={addItem}>
            <Select
              bind:value={categorie}
              label="Catégorie"
              bind:invalid={inputErrors.categorie}
            >
              {#each categories as cat}
                <Option value={cat}>{cat.toUpperCase()}</Option>
              {/each}
            </Select>

            <br />
            <div class="spacer" />

            <Textfield
              label="Titre"
              bind:value={title}
              bind:invalid={inputErrors.title}
            />

            <br />
            <div class="spacer" />

            <Textfield label="Description/Remarques" bind:value={description} />

            <br />
            <div class="spacer" />

            <Textfield label="Prix" bind:value={price} type="number">
              <svelte:fragment slot="trailingIcon">€</svelte:fragment>
            </Textfield>

            <br />
            <div class="spacer" />

            {#if refs.length > 0}
              <div class="separator" />
              <h4>Réferences :</h4>
            {/if}
            <div class="group">
              {#each refs as ref, i}
                <div class="flex">
                  <Textfield label={"Réference " + (i + 1)} bind:value={ref} />
                  <IconButton
                    class="material-icons"
                    type="button"
                    on:click={() => removeRef(ref)}>delete</IconButton
                  >
                </div>
              {/each}
            </div>
            <Button type="button" on:click={addRef}
              ><Icon class="material-icons">add</Icon>
              <Label>Ajouter une ref</Label></Button
            >
            <br />
            <div class="spacer" />

            {#if images.length > 0}
              <div class="separator" />
              <h4>Images :</h4>
            {/if}
            <div class="group">
              {#each images as img, i}
                <div class="flex">
                  <Textfield label={"Image " + (i + 1)} bind:value={img} />
                  <IconButton
                    class="material-icons"
                    type="button"
                    on:click={() => removeImg(img)}>delete</IconButton
                  >
                </div>
              {/each}
            </div>
            <Button type="button" on:click={addImage}
              ><Icon class="material-icons">add</Icon>
              <Label>Ajouter une image</Label></Button
            >
            <br />
            <div class="spacer" />

            <div class="flex center">
              <Button variant="raised" type="submit" class="add-button">
                {#if modifId}Mettre à jour{:else}Ajouter{/if}
              </Button>
            </div>
          </form>
        </Content>
      </Card>
    {/if}
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
</main>
<Footer />

<style>
  h1 {
    text-align: center;
    margin-bottom: 1em;
  }

  :global(.euro-icon) {
    font-size: large;
  }

  :global(.snackbar-warning-container > .mdc-snackbar__surface) {
    background-color: #b00020;
  }

  .group {
    margin-left: 0.5em;
    margin-bottom: 0.125em;
  }

  :global(#addCard) {
    width: 50vw;
    margin: auto;
    margin-top: 2em;
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

  @media (max-width: 768px) {
    :global(#addCard) {
      width: 90vw;
    }

    .error {
      width: 60vw;
    }

    :global(.smui-text-field--standard),
    :global(.mdc-select) {
      width: 85%;
    }
  }
</style>
