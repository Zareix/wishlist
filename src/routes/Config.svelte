<script>
  import { onMount } from "svelte"

  import { db } from "../firebase"
  import { user } from "../stores"

  import TextField from "@smui/textfield"
  import Button, { Icon } from "@smui/button"
  import Snackbar, { Actions, Label } from "@smui/snackbar"
  import IconButton from "@smui/icon-button"
  import Card, { Content } from "@smui/card"

  import TopBar from "../components/TopBar.svelte"
  import BackButton from "../components/BackButton.svelte"

  let currentUser
  const unsubcribe = user.subscribe((v) => (currentUser = v))

  let canWatch = []
  let snackbar
  let snackbarText = ""
  onMount(() => {
    db.collection("permissions")
      .doc(currentUser.email)
      .get()
      .then((res) => (canWatch = res.data().canWatch))
  })

  const addPermission = () => {
    if (canWatch.length === 10) {
      snackbarText = "Impossible de mettre plus de 10 permissions"
      snackbar.open()
      return
    }
    canWatch = [...canWatch, ""]
  }

  const updatePermissions = () => {
    db.collection("permissions")
      .doc(currentUser.email)
      .set({
        canWatch: canWatch.filter((c) => c !== ""),
      })
      .then(() => {
        snackbarText = "Permissions mises à jour"
        snackbar.open()
      })
  }
</script>

<TopBar />
<main id="settings">
  <BackButton />
  <div id="permissions" class="flex center">
    <Card>
      <Content>
        <div class="padding">
          <h2>Qui peut voir votre Wishlist ?</h2>
          <div class="permissions-inputs">
            {#each canWatch as email, i}
              <TextField label={"Email " + (i + 1)} bind:value={email} />
              <br />
            {/each}
          </div>
          <Button on:click={addPermission}>Ajouter un email</Button>
          <br />
          <div class="spacer" />
          <div class="flex center">
            <Button variant="raised" on:click={updatePermissions}
              >Mettre à jour</Button
            >
          </div>
        </div>

        <Snackbar bind:this={snackbar}>
          <Label>{snackbarText}</Label>
          <Actions>
            <IconButton class="material-icons" title="Fermer">close</IconButton>
          </Actions>
        </Snackbar>
      </Content>
    </Card>
  </div>
</main>

<style>
  h2 {
    margin-bottom: 0.75em;
  }

  #permissions {
    margin-top: 2em;
  }

  .padding {
    padding: 1em;
  }

  .permissions-inputs {
    margin-left: 0.5em;
    margin-bottom: 0.125em;
  }
</style>
