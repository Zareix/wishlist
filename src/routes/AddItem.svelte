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
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  export let modifId = undefined
  export let oldCategorie

  export let location
  const urlParams = new URLSearchParams(location.search)

  const flipDurationMs = 300
  const dropTargetClasses = ["dnd-active"]

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
          .collection(categorie)
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
        .collection(categorie)
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

  const back = () => navigate("/")

  const imageExists = (image_url) => {
    return image_url.startsWith("http")
  }

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

  const handleDndConsiderRefs = (e) => (refs = e.detail.items)
  const handleDndFinalizeRefs = (e) => (refs = e.detail.items)

  const handleDndConsiderImages = (e) => (images = e.detail.items)
  const handleDndFinalizeImages = (e) => (images = e.detail.items)

  const transformDraggedElement = (e) => (e.className = "dnd-item-active")
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

            {#if refs.length > 0}
              <div class="separator" />
              <h4>Réferences :</h4>
            {/if}
            <section
              class="group"
              use:dndzone={{
                items: refs,
                flipDurationMs,
                type: "references",
                dropTargetClasses,
                dropFromOthersDisabled: true,
                transformDraggedElement,
              }}
              on:consider={handleDndConsiderRefs}
              on:finalize={handleDndFinalizeRefs}
            >
              {#each refs as ref (ref.id)}
                <div class="flex" animate:flip={{ duration: flipDurationMs }}>
                  <Icon class="material-icons drag-icon">drag_indicator</Icon>
                  <Textfield
                    label={"Réference " + (refs.indexOf(ref) + 1)}
                    bind:value={ref.value}
                  >
                    <IconButton
                      class="material-icons delete-ref-btn"
                      slot="trailingIcon"
                      on:click={() => removeRef(ref)}>delete</IconButton
                    >
                  </Textfield>
                </div>
              {/each}
            </section>
            <Button type="button" on:click={addNewRef}>
              <Icon class="material-icons">add</Icon>
              <Label>Ajouter une ref</Label>
            </Button>
            <br />
            <div class="spacer" />

            {#if images.length > 0}
              <div class="separator" />
              <h4>Images :</h4>
            {/if}
            <section
              class="group"
              use:dndzone={{
                items: images,
                flipDurationMs,
                type: "images",
                dropTargetClasses,
                dropFromOthersDisabled: true,
                transformDraggedElement,
              }}
              on:consider={handleDndConsiderImages}
              on:finalize={handleDndFinalizeImages}
            >
              {#each images as img (img.id)}
                <div class="flex" animate:flip={{ duration: flipDurationMs }}>
                  <Icon class="material-icons drag-icon">drag_indicator</Icon>
                  <Textfield
                    label={"Image " + (images.indexOf(img) + 1)}
                    bind:value={img.value}
                  >
                    <IconButton
                      class="material-icons delete-image-btn"
                      slot="trailingIcon"
                      on:click={() => removeImg(img)}>delete</IconButton
                    >
                  </Textfield>
                  {#if imageExists(img.value)}
                    <img
                      src={img.value}
                      alt={"thumbnail " + images.indexOf(img)}
                      class="thumbnail"
                    />
                  {/if}
                </div>
              {/each}
            </section>
            <Button type="button" on:click={addNewImg}>
              <Icon class="material-icons">add</Icon>
              <Label>Ajouter une image</Label>
            </Button>
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

  .group {
    margin-left: 0.5em;
    margin-bottom: 0.125em;
  }

  :global(.dnd-active) {
    outline: none !important;
  }

  :global(.dnd-item-active) {
    outline: none !important;
  }

  .flex {
    align-items: center;
  }

  .thumbnail {
    max-width: 25%;
    max-height: 5rem;
    margin-left: 0.5rem;
  }

  :global(.drag-icon) {
    cursor: grab;
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

  @media (prefers-color-scheme: dark) {
    :global(.drag-icon),
    :global(.delete-image-btn),
    :global(.delete-ref-btn) {
      color: #f9fafb;
    }
  }
</style>
