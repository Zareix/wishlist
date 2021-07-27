<script>
  import { onMount } from "svelte"

  import { db } from "../firebase"
  import { user } from "../stores.js"

  import Loading from "../components/Loading.svelte"
  import TopBar from "../components/TopBar.svelte"
  import BackButton from "../components/BackButton.svelte"
  import Footer from "../components/Footer.svelte"
  import NewCatPopup from "../components/NewCatPopup.svelte"
  import LinkInputList from "../components/LinksInputList.svelte"

  import itemNotFoundSvg from "../assets/item-not-found.svg"

  import Select, { Option } from "@smui/select"
  import Button from "@smui/button"
  import { Content } from "@smui/card"
  import Textfield from "@smui/textfield"
  import { navigate } from "svelte-routing"
  import IconButton from "@smui/icon-button"
  import Snackbar, { Actions, Label as LabelSnack } from "@smui/snackbar"
  import Item from "../components/Item.svelte"

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
  let category = ""
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
  let newCatPopupOpen

  onMount(async () => {
    if (urlParams.has("title")) title = urlParams.get("title")
    if (urlParams.has("ref")) addRef(urlParams.get("ref"))
    if (urlParams.has("body")) {
      let body = urlParams.get("body")
      if (
        refs.length === 0 &&
        (body.includes("http://") || body.includes("https://"))
      ) {
        description = body.split("http")[0]
        addRef("http" + body.split("http")[1])
      } else description = body
    }

    const res = await db.collection(currentUser.email).doc("categories").get()
    if (res.exists) categories = res.data().categories

    if (modifId) {
      await db
        .collection(currentUser.email)
        .doc("items")
        .collection(oldCategorie)
        .doc(modifId)
        .get()
        .then((i) => {
          let data = i.data()
          category = oldCategorie
          title = data.title
          data.references.forEach((r) => addRef(r))
          data.images.forEach((i) => addImg(i))
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

    if (category === undefined || category.trim() === "") {
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
      if (oldCategorie !== category) {
        db.collection(currentUser.email)
          .doc("items")
          .collection(oldCategorie)
          .doc(modifId)
          .delete()
          .then(() => {
            return db
              .collection(currentUser.email)
              .doc("items")
              .collection(category)
              .add({
                title,
                description,
                price,
                createdAt,
                references: refs
                  .filter((r) => r.value !== "")
                  .map((r) => r.value),
                images: images
                  .filter((i) => i.value !== "")
                  .map((i) => i.value),
              })
          })
          .then(() => back())
      } else {
        db.collection(currentUser.email)
          .doc("items")
          .collection(category)
          .doc(modifId)
          .update({
            title,
            description,
            price,
            references: refs.filter((r) => r.value !== "").map((r) => r.value),
            images: images.filter((i) => i.value !== "").map((i) => i.value),
          })
          .then(() => back())
      }
    } else {
      db.collection(currentUser.email)
        .doc("items")
        .collection(category)
        .add({
          position: 0,
          title,
          description,
          price,
          createdAt: Date.now(),
          references: refs.filter((r) => r.value !== "").map((r) => r.value),
          images: images.filter((i) => i.value !== "").map((i) => i.value),
        })
        .then(() => back())
    }
  }

  const back = () =>
    navigate(
      "/#" +
        "category" +
        category.charAt(0).toUpperCase() +
        category.slice(1).replace(" ", "")
    )

  const addNewRef = () =>
    (refs = [...refs, { id: Math.floor(Math.random() * 1000), value: "" }])
  const addRef = (ref) =>
    (refs = [...refs, { id: Math.floor(Math.random() * 1000), value: ref }])
  const removeRef = (ref) => (refs = refs.filter((r) => r !== ref))

  const addNewImg = () =>
    (images = [...images, { id: Math.floor(Math.random() * 1000), value: "" }])
  const addImg = (img) =>
    (images = [...images, { id: Math.floor(Math.random() * 1000), value: img }])
  const removeImg = (img) => (images = images.filter((i) => i !== img))

  const switchTitleDesc = () => ([title, description] = [description, title])

  const toggleNewCat = async () => {
    newCatPopupOpen = !newCatPopupOpen
    if (!newCatPopupOpen) {
      const res = await db.collection(currentUser.email).doc("categories").get()
      if (res.exists) categories = res.data().categories
    }
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
      <section id="addCard" class="card">
        <Content>
          <h1>Ajouter un objet</h1>
          <form on:submit={addItem}>
            <div class="flex">
              <Select
                bind:value={category}
                label="Catégorie"
                bind:invalid={inputErrors.categorie}
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
            />

            {#if urlParams.has("title") && description !== ""}
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

            <Textfield label="Prix" bind:value={price} type="number">
              <svelte:fragment slot="trailingIcon">€</svelte:fragment>
            </Textfield>

            <br />
            <div class="spacer" />

            <LinkInputList
              links={refs}
              addNewLink={addNewRef}
              removeLink={removeRef}
              placeholder="Référence"
              title="Références"
            />
            <br />
            <div class="spacer" />

            <LinkInputList
              links={images}
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
<Footer />

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
