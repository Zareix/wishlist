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
    <Link id="navTitle">
      <img src="/icons/icon-512x512.png" class="logo" alt="logo" />
      <Title>Wishlist - {currentUser.displayName}</Title>
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
</style>
