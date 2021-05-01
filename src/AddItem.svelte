<script>
  import { onMount } from "svelte"

  import { db } from "./firebase"
  import { user } from "./stores.js"

  import Select, { Option } from "@smui/select"
  import Button, { Label, Icon } from "@smui/button"
  import Card, { Content } from "@smui/card"
  import TextField from "@smui/textfield"
  import CircularProgress from "@smui/circular-progress"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  export let back

  export let itemModif

  let title = ""
  let adding
  let categorie
  let oldCategorie
  let categories = []
  let refs = []
  let images = []

  onMount(async () => {
    await db
      .collection("categories")
      .get()
      .then((cat) => {
        cat.docs.forEach((d) => (categories = [...categories, d.id]))
      })
    if (itemModif) {
      title = itemModif.title
      refs = itemModif.references
      images = itemModif.images
      categorie = itemModif.categorie
      oldCategorie = itemModif.categorie
    }
  })

  const addItem = (e) => {
    e.preventDefault()
    if (categorie === undefined) return
    if (itemModif) {
      if (oldCategorie !== categorie) {
        adding = db
          .collection(currentUser.email)
          .doc("items")
          .collection(oldCategorie)
          .doc(itemModif.id)
          .delete()

        adding.then(
          () =>
            (adding = db
              .collection(currentUser.email)
              .doc("items")
              .collection(categorie)
              .add({
                title,
                createdAt: Date.now(),
                references: refs.filter((r) => r !== ""),
                images: images.filter((i) => i !== ""),
              }))
        )
      } else {
        adding = db
          .collection(currentUser.email)
          .doc("items")
          .collection(categorie)
          .doc(itemModif.id)
          .update({
            title,
            createdAt: Date.now(),
            references: refs.filter((r) => r !== ""),
            images: images.filter((i) => i !== ""),
          })
      }
    } else {
      adding = db
        .collection(currentUser.email)
        .doc("items")
        .collection(categorie)
        .add({
          title,
          createdAt: Date.now(),
          references: refs.filter((r) => r !== ""),
          images: images.filter((i) => i !== ""),
        })
    }
  }

  const addRef = () => {
    refs = [...refs, ""]
  }

  const addImage = () => {
    images = [...images, ""]
  }
</script>

<div>
  {#if adding}
    <div>
      {#await adding}
        <div class="loading flex center">
          <CircularProgress style="height: 48px; width: 48px;" indeterminate />
        </div>
      {:then}
        <div class="loading flex center">
          <div>
            <h2>
              Item {#if itemModif}mise à jour{:else}ajouté{/if} !
            </h2>
            <Button on:click={back}>
              <Icon class="material-icons">arrow_back</Icon>
              <Label>back</Label>
            </Button>
          </div>
        </div>
      {/await}
    </div>
  {:else}
    <Button on:click={back} color="secondary">
      <Icon class="material-icons">arrow_back</Icon>
      <Label>back</Label>
    </Button>
    <div id="addSection">
      <Card padded>
        <Content>
          <h1>Ajouter un objet</h1>
          <form on:submit={addItem}>
            <Select bind:value={categorie} label="Catégorie">
              {#each categories as cat}
                <Option value={cat}>{cat.toUpperCase()}</Option>
              {/each}
            </Select>
            <br />
            <div class="spacer" />

            <TextField label="Titre" bind:value={title} />
            <br />
            <div class="spacer" />

            {#if refs.length > 0}
              <div class="separator" />
              <h4>Réferences :</h4>
            {/if}
            <div class="group">
              {#each refs as ref, i}
                <TextField label={"Réference " + (i + 1)} bind:value={ref} />
                <br />
              {/each}
            </div>
            <Button type="button" on:click={addRef}>Ajouter une ref</Button>
            <br />
            <div class="spacer" />

            {#if images.length > 0}
              <div class="separator" />
              <h4>Images :</h4>
            {/if}
            <div class="group">
              {#each images as img, i}
                <TextField label={"Image " + (i + 1)} bind:value={img} />
                <br />
              {/each}
            </div>
            <Button type="button" on:click={addImage}>Ajouter une image</Button>
            <br />
            <div class="spacer" />

            <div class="flex center">
              <Button variant="raised" type="submit" class="add-button">
                {#if itemModif}Mettre à jour{:else}Ajouter{/if}
              </Button>
            </div>
          </form>
        </Content>
      </Card>
    </div>
  {/if}
</div>

<style>
  h1 {
    text-align: center;
    margin-bottom: 1em;
  }

  .loading {
    text-align: center;
    height: 70vh;
    align-items: center;
  }

  .group {
    margin-left: 0.5em;
    margin-bottom: 0.125em;
  }

  .spacer {
    height: 1em;
  }

  #addSection {
    width: 50vw;
    margin: auto;
  }

  @media (max-width: 768px) {
    #addSection {
      width: 80vw;
    }
  }
</style>
