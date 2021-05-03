<script>
  import Button, { Icon, Label } from "@smui/button"
  import { Link } from "svelte-routing"

  export let url = "/"
</script>

<Link to={url} id="back-btn">
  <Button>
    <Icon class="material-icons">arrow_back</Icon>
    <Label>back</Label>
  </Button>
</Link>

<style>
</style>
