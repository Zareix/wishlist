<script>
  import Button, { Icon, Label } from "@smui/button"
  import { Link } from "svelte-routing"

  export let url = "/"
</script>

<Link to={url} id="backButton">
  <Button>
    <Icon class="material-icons">arrow_back</Icon>
    <Label>back</Label>
  </Button>
</Link>

<style>
  :global(#back-btn) {
    margin-left: 1rem;
    margin-bottom: 0.75rem;
  }
</style>
