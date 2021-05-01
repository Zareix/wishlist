<script>
  import { auth } from "./firebase"
  import { user } from "./stores"

  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar"
  import IconButton from "@smui/icon-button"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  export let back
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
      <IconButton
        class="material-icons"
        aria-label="logout"
        on:click={() => auth.signOut()}>logout</IconButton
      >
    </Section>
  </Row>
</TopAppBar>

<style>
  .cursor-pointer {
    cursor: pointer;
  }
</style>
