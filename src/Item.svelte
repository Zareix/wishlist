<script>
  import Card, { Content, ActionIcons } from "@smui/card"
  import IconButton from "@smui/icon-button"

  export let item
  export let modif
</script>

<li>
  <Card padded variant="outlined">
    <Content>
      <h3>
        {item.title}
      </h3>
      <div class="separator" />
      <div class="flex image-list">
        {#each item.images as image, i}
          <img src={image} alt={"item-" + i} />
        {/each}
      </div>
      <h4>Références :</h4>
      <ul>
        {#if item.references.length === 0}
          <li>Aucune référence</li>
        {:else}
          {#each item.references as ref, i}
            <li><a href={ref}>{ref}</a></li>
          {/each}
        {/if}
      </ul>
    </Content>
    <ActionIcons>
      <IconButton on:click={() => modif(item)} class="material-icons"
        >edit</IconButton
      >
    </ActionIcons>
  </Card>
</li>

<style>
  li {
    margin: 0 1.5em;
    padding-bottom: 0.5em;
  }

  h3 {
    margin-bottom: 1em;
  }

  h4 {
    margin: 0.5em;
  }

  ul {
    padding-left: 1em;
  }

  .image-list {
    width: 100%;
    flex-wrap: wrap;
    gap: 0.5em 1em;
    align-items: center;
    align-content: center;
  }

  img {
    width: 30%;
    max-height: 15rem;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    img {
      width: 50%;
    }
  }
</style>
