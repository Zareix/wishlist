<script>
  import { auth, googleProvider } from "./firebase"
  import { authState } from "rxfire/auth"

  import Content from "./Content.svelte"
  import Login from "./Login.svelte"
  
  let user

  const unsubscribe = authState(auth).subscribe((u) => (user = u))

  const login = () => auth.signInWithPopup(googleProvider)
</script>

<main>
  {#if user}
    <Content {user} />
  {:else}
    <Login {login}/>
  {/if}
</main>

<style>
</style>
