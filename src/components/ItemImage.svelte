<script>
  import Dialog, { Content, Actions } from "@smui/dialog"
  import Button, { Label } from "@smui/button"

  export let image
  export let index
  export let title

  let open = false
</script>

<div class="image">
  <img
    src={image}
    alt={index + " of item"}
    on:click={() => (open = true)}
    class="pointer"
  />
  <Dialog bind:open>
    <h2>{title}</h2>
    <Content>
      <div class="flex center" on:click={() => (open = false)}>
        <img src={image} alt={"item " + index} class="image-dialog" />
      </div>
    </Content>
    <Actions>
      <Button on:click={() => (open = false)}>
        <Label>Fermer</Label>
      </Button>
    </Actions>
  </Dialog>
</div>

<style>
  h2 {
    margin: 0.75em 1em;
  }

  img {
    max-width: 100%;
    max-height: 15rem;
    object-fit: contain;
  }

  .image {
    max-width: 30%;
    max-height: 15rem;
  }

  .image-dialog {
    max-height: 80vh;
  }

  @media (max-width: 768px) {
    .image {
      max-width: 40%;
    }
  }
</style>
