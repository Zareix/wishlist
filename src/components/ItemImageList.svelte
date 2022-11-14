<script lang="ts">
  import ItemImage from "./ItemImage.svelte"

  export let images = []
  export let title = ""
</script>

<ul class={images.length > 1 ? "list" : ""}>
  {#each images as image, index}
    <ItemImage {title} {image} {index} />
  {/each}
</ul>

<style>
  ul {
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    min-height: 6rem;
  }
  
  ul:not(.list){
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .list {
    position: relative;
    width: 100%;
    gap: 0.25rem;
    overflow-y: hidden;
    overflow-x: scroll;
    white-space: nowrap;
  }
</style>
