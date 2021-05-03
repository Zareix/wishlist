<script>
  import { onMount } from "svelte"

  import { db } from "../firebase"
  import { user } from "../stores.js"

  import Loading from "../components/Loading.svelte"
  import TopBar from "../components/TopBar.svelte"
  import BackButton from "../components/BackButton.svelte"

  import Select, { Option } from "@smui/select"
  import Button, { Label, Icon } from "@smui/button"
  import Card, { Content } from "@smui/card"
  import TextField from "@smui/textfield"
  import { navigate } from "svelte-routing"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  export let modifId
  export let oldCategorie

  let title = ""
  let loading = false
  let description = ""
  let categorie
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

    if (modifId) {
      await db
        .collection(currentUser.email)
        .doc("items")
        .collection(oldCategorie)
        .doc(modifId)
        .get()
        .then((i) => {
          categorie = oldCategorie
          title = i.data().title
          refs = i.data().references
          images = i.data().images
          description = i.data().description
        })
    }
  })

  const addItem = (e) => {
    e.preventDefault()
    if (categorie === undefined) return
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
                createdAt: Date.now(),
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
            createdAt: Date.now(),
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

  const addImage = () => {
    images = [...images, ""]
  }
</script>

<TopBar />
<main>
  {#if loading}
    <Loading />
  {:else}
    <BackButton />
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

            <TextField label="Description/Remarques" bind:value={description} />
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
                <TextField label={"Image " + (i + 1)} bind:value={img} />
                <br />
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
    </div>
  {/if}
</main>

<style>
  h1 {
    text-align: center;
    margin-bottom: 1em;
  }

  .group {
    margin-left: 0.5em;
    margin-bottom: 0.125em;
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
