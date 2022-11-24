<script lang="ts">
  import { dialogImage } from '../stores';

  export let image: string;
  export let index: number;
  export let title: string;

  let error: boolean;

  const open = () => {
    dialogImage.set({
      src: image,
      index,
      title,
    });
  };
</script>

<li class="image">
  {#if error}
    <div class="error">Error loading image {index}</div>
  {:else}
    <img
      on:error={() => (error = true)}
      src={image}
      alt={'Thumbnail ' + index + ' of ' + title}
      on:click={open}
      on:keypress={open}
      class="pointer"
    />
  {/if}
</li>

<style>
  img {
    display: block;
    position: relative;
    width: 100%;
    max-height: 12rem;
    object-fit: cover;
  }

  .image {
    vertical-align: middle;
    display: inline-flex;
    width: 100%;
    min-height: 6rem;
    max-height: 8rem;
    border-radius: 16px;
    overflow: hidden;
    align-items: center;
  }

  .image:not(:last-child) {
    margin-right: 0.25rem;
  }

  .error {
    max-width: 5rem;
    margin: 0 auto;
    height: 100%;
    white-space: pre-wrap;
    text-align: center;
    color: var(--red);
  }
</style>
