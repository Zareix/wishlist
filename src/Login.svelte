<script>
  import { auth, googleProvider } from "./firebase"
  import { user } from "./stores"

  import { authState } from "rxfire/auth"
  import Button, { Icon, Label } from "@smui/button"

  const unsubscribe = authState(auth).subscribe((u) => {
    user.set(u)
  })

  const login = () => auth.signInWithPopup(googleProvider)
</script>

<div class="connect">
  <h1>Wishlist</h1>
  <Button on:click={login} variant="raised">
    <Icon class="material-icons">login</Icon>
    <Label>Se connecter avec Google</Label>
  </Button>
</div>

<style>
  div {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1 {
    text-align: center;
  }
</style>
