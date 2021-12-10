<script>
  import Dialog, { Content, Actions } from "@smui/dialog"
  import Button, { Label } from "@smui/button"

  export let image
  export let index
  export let title

  let open = false
</script>

<li class="image">
  <img
    src={image}
    alt={"Thumbnail " + index + " of " + title}
    on:click={() => (open = true)}
    class="pointer"
  />
  <Dialog bind:open>
    <h2>{title}</h2>
    <Content>
      <div class="flex center" on:click={() => (open = false)}>
        <img
          src={image}
          alt={"Image " + index + " de " + title}
          class="image-dialog"
        />
      </div>
    </Content>
    <Actions>
      <Button on:click={() => (open = false)}>
        <Label>Fermer</Label>
      </Button>
    </Actions>
  </Dialog>
</li>

<style>
  h2 {
    margin: 0.75em 1em;
  }

  img {
    display: block;
    position: relative;
    width: 100%;
    max-height: 12rem;
    object-fit: cover;
  }

  img::before {
    content: "";
    position: absolute;
    background-color: rgb(228, 228, 228);
    border: 1px hsl(0, 0%, 66.7%);
    display: block;
    height: 100%;
    width: 100%;
  }

  img::after {
    content: attr(alt);
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    text-align: center;
    color: rgb(122, 122, 122);
    font-weight: 400;
    font-style: italic;
  }

  .image {
    vertical-align: middle;
    display: inline-flex;
    width: 100%;
    min-height: 6rem;
    max-height: 12rem;
    border-radius: 16px;
    overflow: hidden;
    align-items: center;
  }

  .image:not(:last-child) {
    margin-right: 0.25rem;
  }

  .image-dialog {
    max-height: 60vh;
  }
</style>
