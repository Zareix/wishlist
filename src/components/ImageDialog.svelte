<script lang="ts">
  import Dialog, { Content, Actions } from "@smui/dialog"
  import Button, { Label } from "@smui/button"

  import { dialogImage } from "../stores"
  import { onDestroy } from "svelte"

  let image

  const unsubscribe = dialogImage.subscribe((i) => (image = i))

  onDestroy(() => unsubscribe())

  $: isOpen = image !== null
</script>

{#if image !== null}
  <Dialog bind:open={isOpen} scrimClickAction="" escapeKeyAction="">
    <h2>{image.title}</h2>
    <Content>
      <div class="flex center">
        <img
          src={image.src}
          alt={"Image " + image.index + " de " + image.title}
          class="image-dialog"
        />
      </div>
    </Content>
    <Actions>
      <Button on:click={() => dialogImage.set(null)}>
        <Label>Fermer</Label>
      </Button>
    </Actions>
  </Dialog>
{/if}

<style>
  .image-dialog {
    object-fit: contain;
    max-height: 60vh;
  }

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
</style>
