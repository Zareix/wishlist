<script>
  import { auth } from "../firebase"
  import { user } from "../stores"

  import TopAppBar, { Section, Title } from "@smui/top-app-bar"
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

<TopAppBar variant="fixed" id="navbar">
  <nav class="mdc-top-app-bar__row">
    <Section>
      <Link id="navTitle">
        <Title>Wishlist - {currentUser.displayName}</Title>
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
  </nav>
</TopAppBar>

<style>
  :global(#navTitle) {
    color: white;
    margin-right: 1em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
