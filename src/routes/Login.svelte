<script>
  import { onDestroy, onMount } from "svelte"

  import { auth } from "../firebase"
  import { user } from "../stores"

  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
  import { authState } from "rxfire/auth"
  import Button, { Label } from "@smui/button"
  import { navigate } from "svelte-routing"

  import Loading from "../components/Loading.svelte"
  import Footer from "../components/Footer.svelte"

  import loginSvg from "../assets/login.svg"

  let loading = true

  onMount(() =>
    setTimeout(() => {
      loading = false
    }, 2000)
  )

  const unsubscribe = authState(auth).subscribe((u) => {
    user.set(u)
  })

  onDestroy(() => unsubscribe.unsubscribe())

  const login = () =>
    signInWithPopup(auth, new GoogleAuthProvider()).then(() =>
      navigate("/", { replace: false })
    )
</script>

<svelte:head>
  <title>Wishlist - Login</title>
</svelte:head>

<main id="login">
  {#if loading}
    <Loading />
  {:else}
    <h1>Wishlist</h1>
    <div class="illustration">
      {@html loginSvg}
    </div>
    <h2>Se connecter :</h2>
    <Button on:click={login} variant="raised">
      <svg
        width="20"
        height="20"
        fill="#FFF"
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg"
        class="google"
      >
        <path
          d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"
        />
      </svg>
      <Label>Avec Google</Label>
    </Button>
  {/if}
</main>
<Footer />

<style>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1 {
    text-align: center;
    margin: 1rem 0;
  }

  h2 {
    margin: 0.5rem 0;
  }

  .google {
    margin-right: 0.5rem;
  }

  :global(.illustration) {
    max-width: 20rem;
  }

  :global(.illustration > svg) {
    width: 100%;
    height: fit-content;
  }
</style>
