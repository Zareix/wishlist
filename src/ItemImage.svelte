<script>
  import Dialog, { Content, Actions } from "@smui/dialog"
  import IconButton, { Icon } from "@smui/icon-button"

  export let image
  export let index
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
    <Content id="default-focus-content">
      <div class="flex center" on:click={() => (open = false)}>
        <img src={image} alt={"item-" + index} class="image-dialog" />
      </div>
    </Content>
  </Dialog>
</div>

<style>
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
