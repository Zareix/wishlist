<script>
  import { Route } from "svelte-routing"

  import { user } from "../stores"

  import Login from "./Login.svelte"

  export let path
  export let component

  $: isAuthenticated = $user
</script>

{#if isAuthenticated}
  <Route {path} {component} />
{:else}
  <Route {path} component={Login} />
{/if}
