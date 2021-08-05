<script>
  import { auth } from "../firebase"
  import { user } from "../stores"

  import TopAppBar, { Section, Title } from "@smui/top-app-bar"
  import IconButton from "@smui/icon-button"
  import { Link, navigate } from "svelte-routing"
  import Fab, { Icon as FabIcon } from "@smui/fab"

  import Footer from "./Footer.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  export let active = ""

  const logout = () => {
    navigate("/login")
    auth.signOut()
    user.set(null)
  }
</script>

<TopAppBar variant="fixed" id="navbar">
  <Section class="mdc-top-app-bar__row">
    <Link id="navTitle">
      <img src="/icons/icon-512x512.png" class="logo" alt="logo" />
      <Title>Wishlist - {currentUser.displayName}</Title>
    </Link>
  </Section>
</TopAppBar>
<slot />
<nav class="bottom-navbar">
  <Link to="/" class={"navlink" + (active === "home" ? " navlink-active" : "")}>
    <IconButton class="navlink-icon material-icons-outlined">home</IconButton>
    <p class="navlink-text">Home</p>
  </Link>
  <Link
    to="/archive"
    class={"navlink" + (active === "archive" ? " navlink-active" : "")}
  >
    <IconButton class="navlink-icon material-icons-outlined">archive</IconButton
    >
    <p class="navlink-text">Archive</p>
  </Link>
  <Link
    to="/add"
    class={"navlink" + (active === "add" ? " navlink-active" : "")}
  >
    <Fab color="primary" class="fab">
      <FabIcon class="material-icons fab-icon">add</FabIcon>
    </Fab>
  </Link>
  <Link
    to="/settings"
    class={"navlink" + (active === "settings" ? " navlink-active" : "")}
  >
    <IconButton class="navlink-icon material-icons-outlined"
      >settings</IconButton
    >
    <p class="navlink-text">Paramètres</p>
  </Link>
  <div on:click={logout} class="navlink">
    <IconButton class="navlink-icon material-icons-outlined">logout</IconButton>
    <p class="navlink-text">Déconnexion</p>
  </div>
</nav>
<Footer />

<style>
  :global(#navTitle) {
    color: white;
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .logo {
    margin-left: 1rem;
    width: 2rem;
  }

  .bottom-navbar {
    position: fixed;
    z-index: 100;
    bottom: -10px;
    width: 100%;
    height: 3rem;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    justify-items: center;
    align-content: center;
    padding-top: 0.25rem;
    padding-bottom: calc(0.25rem + 10px);
    border-top: 1px solid rgba(163, 163, 163, 0.2);
    background-color: var(--mdc-theme-background);
  }

  :global(.navlink) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :global(.navlink-icon) {
    height: auto;
    width: auto;
    padding: 0;
    opacity: 0.8;
  }

  .navlink-text {
    margin: 0;
    overflow: hidden;
    height: 0;
    font-size: 0.8rem;
    font-weight: 500;
    opacity: 0.8;
  }

  :global(.navlink-active) :global(.navlink-icon) {
    font-family: "Material Icons";
    opacity: 1;
  }

  :global(.navlink-active) .navlink-text {
    height: 1rem;
    animation: slideIn 250ms ease;
    opacity: 1;
  }

  @keyframes slideIn {
    from {
      height: 0;
    }
    to {
      height: 1rem;
    }
  }

  :global(.fab) {
    background-color: var(--green) !important;
    position: relative;
    bottom: 1rem;
  }

  :global(.navlink-active) :global(.fab-icon) {
    font-weight: 600;
  }
</style>
