<script>
  import emptySvg from "../assets/empty.svg"

  export let title = "C'est vide par ici 👀"
  export let subtitle = ""
</script>

<div id="noContent">
  <div class="empty-svg">
    {@html emptySvg}
  </div>
  <h2>{title}</h2>
  <h3 class="text-gray">{subtitle}</h3>
</div>

<style>
  h2 {
    margin-top: 0.5em;
  }

  h3 {
    font-weight: 400;
  }

  .empty-svg {
    width: 100%;
  }

  #noContent {
    margin: 2rem;
    text-align: center;
  }
</style>
