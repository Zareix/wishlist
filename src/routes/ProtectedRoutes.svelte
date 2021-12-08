<script>
  import { Route } from "svelte-routing"
  import Layout from "../components/Layout.svelte"

  import { user } from "../stores"

  import Login from "./Login.svelte"

  export let path
  export let component

  $: isAuthenticated = $user

  history.pushState = new Proxy(history.pushState, {
    apply(target, thisArg, argumentsList) {
      scrollTo(0, 0)
      Reflect.apply(target, thisArg, argumentsList)
    },
  })
</script>

{#if isAuthenticated}
  <Route {path} {component} />
{:else}
  <Route {path} component={Login} />
{/if}
