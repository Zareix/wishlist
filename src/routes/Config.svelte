<script>
  import { onMount } from "svelte"

  import { db } from "../firebase"
  import { user } from "../stores"

  import TextField from "@smui/textfield"
  import Button, { Icon, Label as BtnLabel } from "@smui/button"
  import Snackbar, { Actions, Label } from "@smui/snackbar"
  import IconButton from "@smui/icon-button"
  import Switch from "@smui/switch"
  import FormField from "@smui/form-field"

  import Layout from "../components/Layout.svelte"
  import Loading from "../components/Loading.svelte"

  let currentUser
  const unsubcribe = user.subscribe((v) => (currentUser = v))

  let canWatch = []
  let snackbar
  let snackbarText = ""
  let categories = []
  let loadingCanWatch = true
  let loadingVisibleCat = true

  onMount(async () => {
    let authorizedCat = []
    db.collection("permissions")
      .doc(currentUser.email)
      .get()
      .then((res) => {
        if (res.exists) {
          canWatch = res.data().canWatch
          if (res.data().authorizedCat) authorizedCat = res.data().authorizedCat
        }
        loadingCanWatch = false
      })
      .catch((error) => {
        loadingCanWatch = false
        console.log(error)
      })

    const res = await db.collection(currentUser.email).doc("categories").get()
    if (res.exists) {
      categories = res
        .data()
        .categories.map((c) => ({ name: c, checked: false }))
      loadingVisibleCat = false
    } else
      await db
        .collection("categories")
        .get()
        .then((data) => {
          data.forEach(
            (cat) =>
              (categories = [...categories, { name: cat.id, checked: false }])
          )
          loadingVisibleCat = false
        })

    authorizedCat.forEach(
      (ac) =>
        (categories.find(
          (c) => c.name.toLowerCase() === ac.toLowerCase()
        ).checked = true)
    )

    categories = categories.sort((a, b) => {
      a.name = a.name.toLowerCase()
      b.name = b.name.toLowerCase()
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
  })

  const addPermission = () => {
    if (canWatch.length === 10) {
      snackbarText = "Impossible de mettre plus de 10 permissions"
      snackbar.open()
      return
    }
    canWatch = [...canWatch, ""]
  }

  const submit = async (e) => {
    e.preventDefault()

    db.collection("permissions")
      .doc(currentUser.email)
      .set({
        canWatch: canWatch.filter((c) => c !== ""),
        authorizedCat: categories.filter((c) => c.checked).map((c) => c.name),
      })
      .then(() => {
        snackbarText = "Permissions mises à jour"
        snackbar.open()
      })
  }
</script>

<Layout active="settings">
  <main id="settings">
    <form id="permissions" class="card" on:submit={submit}>
      <h2>Qui peut voir votre Wishlist ?</h2>
      {#if loadingCanWatch}
        <Loading />
      {:else}
        <div class="permissions-inputs">
          {#each canWatch as email, i}
            <TextField label={"Email " + (i + 1)} bind:value={email} />
            <br />
          {/each}
        </div>
        <Button
          on:click={addPermission}
          type="button"
          class="perm-add-email-btn"
          ><Icon class="material-icons">add</Icon><BtnLabel
            >Ajouter un email</BtnLabel
          ></Button
        >
      {/if}

      <br />
      <hr />

      <h2>Quelles catégories sont visibles par les autres ?</h2>
      {#if loadingVisibleCat}
        <Loading />
      {:else}
        <div class="categories">
          {#each categories as c, i}
            <FormField
              align={i % 2 === 0 ? "end" : "start"}
              class="perm-category-input"
            >
              <Switch bind:checked={categories[i].checked} />
              <span slot="label" class="category">{c.name}</span>
            </FormField>
          {/each}
        </div>
      {/if}

      <br />

      <div class="validate">
        {#if !loadingCanWatch && !loadingVisibleCat}
          <Button variant="raised" type="submit">Tout mettre à jour</Button>
        {/if}
      </div>
    </form>
  </main>
  <Snackbar bind:this={snackbar}>
    <Label>{snackbarText}</Label>
    <Actions>
      <IconButton class="material-icons" title="Fermer">close</IconButton>
    </Actions>
  </Snackbar>
</Layout>

<style>
  h2 {
    margin-bottom: 0.75em;
    text-align: center;
  }

  hr {
    margin: 2rem auto;
  }

  .card {
    padding: 1.5rem;
  }

  .permissions-inputs {
    margin-left: 0.5em;
    margin-bottom: 0.25em;
  }

  :global(.perm-add-email-btn) {
    margin-top: 0.5rem;
  }

  .categories {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .category {
    text-transform: capitalize;
  }

  :global(.perm-category-input:nth-child(2n + 1)) {
    justify-self: end;
  }

  .validate {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
</style>
