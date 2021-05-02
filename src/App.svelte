<script>
  import { user } from "./stores"

  import Content from "./Content.svelte"
  import Login from "./Login.svelte"

  let currentUser

  user.subscribe((v) => (currentUser = v))
</script>

{#if currentUser !== null}
  <Content />
{:else}
  <Login />
{/if}

<style>
</style>
