<script>
  import { user } from "./stores"

  import Content from "./Content.svelte"
  import Login from "./Login.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))
</script>

<main>
  {#if currentUser}
    <Content />
  {:else}
    <Login />
  {/if}
</main>

<style>
</style>
