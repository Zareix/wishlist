<script>
  import { onDestroy } from "svelte"

  import { user } from "../stores"

  import TopAppBar, { Section, Title } from "@smui/top-app-bar"
  import { Link } from "svelte-routing"

  import Footer from "./Footer.svelte"
  import NavBar from "./NavBar.svelte"

  let currentUser
  const unsubscribe = user.subscribe((v) => (currentUser = v))

  export let active = ""
  export let pageTitle

  onDestroy(() => unsubscribe())
</script>

<svelte:head>
  <title>Wishlist - {pageTitle}</title>
</svelte:head>

<TopAppBar variant="fixed" id="navbar">
  <Section class="mdc-top-app-bar__row">
    <Link id="nav-link">
      <img src="/icons/icon-512x512.png" class="logo" alt="logo" />
      <Title class="nav-title">Wishlist - {currentUser.displayName}</Title>
    </Link>
  </Section>
</TopAppBar>
<slot />
<NavBar {active} />
<Footer />

<style>
  .logo {
    margin-left: 1rem;
    width: 2rem;
  }

  :global(.mdc-top-app-bar--fixed-scrolled) {
  }

  :global(#nav-link) {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(.nav-title) {
    color: #f9fafb;
    font-weight: 600;
  }

  :global(#nav-link::after) {
    content: "";
    width: 2rem;
    height: 1px;
    display: block;
  }
</style>
