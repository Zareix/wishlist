<script>
  import emptySvg from "../assets/empty.svg"

  export let title = "C'est vide par ici 👀"
  export let subtitle = ""
</script>

<li id="noContent">
  <div class="empty-svg">
    {@html emptySvg}
  </div>
  <h2>{title}</h2>
  <h3 class="text-gray">{subtitle}</h3>
</li>

<style>
  h2 {
    margin-top: 0.5em;
  }

  h3 {
    font-weight: 400;
  }

  .empty-svg {
    margin: auto;
    width: clamp(4rem, 100%, 16rem);
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 100%;
    }
  }

  #noContent {
    opacity: 0;
    margin: 2rem;
    text-align: center;
    animation: fadeIn 250ms 2s forwards;
  }
</style>
