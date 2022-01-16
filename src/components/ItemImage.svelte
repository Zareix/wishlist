<script>
  import { dialogImage } from "../stores"

  export let image
  export let index
  export let title

  const open = () => {
    dialogImage.set({
      src: image,
      index,
      title,
    })
  }
</script>

<li class="image">
  <img
    src={image}
    alt={"Thumbnail " + index + " of " + title}
    on:click={open}
    class="pointer"
  />
</li>

<style>
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
    max-height: 8rem;
    border-radius: 16px;
    overflow: hidden;
    align-items: center;
  }

  .image:not(:last-child) {
    margin-right: 0.25rem;
  }
</style>
