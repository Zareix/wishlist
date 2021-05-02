<script>
  import { auth } from "./firebase"
  import { user } from "./stores"

  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar"
  import IconButton from "@smui/icon-button"
  import Tooltip, { Wrapper } from "@smui/tooltip"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  export let back
  export let goToConfig
</script>

<TopAppBar variant="fixed">
  <Row>
    <Section>
      <Title on:click={back}
        ><span class="cursor-pointer">Wishlist - {currentUser.displayName}</span
        ></Title
      >
    </Section>
    <Section align="end" toolbar>
      <Wrapper>
        <IconButton
          class="material-icons"
          aria-label="logout"
          on:click={goToConfig}>settings</IconButton
        >
        <Tooltip>Paramètres</Tooltip>
      </Wrapper>
      <Wrapper>
        <IconButton
          class="material-icons"
          aria-label="logout"
          on:click={() => {
            auth.signOut()
            user.set(null)
          }}>logout</IconButton
        >
        <Tooltip>Déconnexion</Tooltip>
      </Wrapper>
    </Section>
  </Row>
</TopAppBar>

<style>
  .cursor-pointer {
    cursor: pointer;
  }
</style>
