<script>
  import page404Svg from "../assets/error-404.svg"

  import Button, { Icon, Label } from "@smui/button"
  import { navigate } from "svelte-routing"
</script>

<main id="page404">
  <section class="error404">
    {@html page404Svg}
    <h1>Page introuvable</h1>
    <div id="backHomeBtn">
      <Button
        on:click={() => navigate("/", { replace: false })}
        variant="raised"
      >
        <Icon class="material-icons">home</Icon>
        <Label>Revenir à l'accueil</Label>
      </Button>
    </div>
  </section>
</main>

<style>
  #page404 {
    display: flex;
  }

  h1 {
    font-weight: 500;
    margin: 0.5em 0;
  }

  .error404 {
    width: 40%;
    margin: auto;
    text-align: center;
  }

  @media (max-width: 768px) {
    .error404 {
      width: 60%;
    }
  }
</style>
