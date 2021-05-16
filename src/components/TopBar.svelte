<script>
  import { auth } from "../firebase"
  import { user } from "../stores"

  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar"
  import IconButton from "@smui/icon-button"
  import Tooltip, { Wrapper } from "@smui/tooltip"
  import { Link, navigate } from "svelte-routing"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  const logout = () => {
    navigate("/login")
    auth.signOut()
    user.set(null)
  }
</script>

<TopAppBar variant="fixed">
  <Row>
    <Section>
      <Link>
        <Title>
          <span class="cursor-pointer white"
            >Wishlist - {currentUser.displayName}</span
          >
        </Title>
      </Link>
    </Section>
    <Section align="end" toolbar
      ><Wrapper>
        <Link to="/archive">
          <IconButton class="material-icons" aria-label="logout"
            >archive</IconButton
          >
        </Link>

        <Tooltip>Archive</Tooltip>
      </Wrapper>
      <Wrapper>
        <Link to="/settings">
          <IconButton class="material-icons" aria-label="logout"
            >settings</IconButton
          >
        </Link>

        <Tooltip>Paramètres</Tooltip>
      </Wrapper>
      <Wrapper>
        <IconButton class="material-icons" aria-label="logout" on:click={logout}
          >logout</IconButton
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
