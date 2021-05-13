<script>
  import { db } from "../firebase"
  import { user } from "../stores"

  import Card, { Content, ActionIcons } from "@smui/card"
  import IconButton from "@smui/icon-button"
  import Tooltip, { Wrapper } from "@smui/tooltip"

  import ItemImage from "./ItemImage.svelte"
  import { Link } from "svelte-routing"

  export let item
  export let removeItem
  export let canModif

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  const formatRef = (ref) => {
    ref = ref.replace(new RegExp("(http)(s)?(://)"), "")
    if (ref.indexOf("/") >= 0) return ref.slice(0, ref.indexOf("/"))
    return ref
  }

  const deleteItem = () => {
    db.collection(currentUser.email)
      .doc("items")
      .collection(item.categorie)
      .doc(item.id)
      .delete()
      .then(() => {
        removeItem(item)
      })
  }
</script>

<li>
  <Card padded variant="outlined">
    <Content>
      <h3>
        {item.title}
      </h3>
      {#if item.description && item.description !== ""}
        <p>{item.description}</p>
      {/if}
      <div class="separator" />
      <div class="flex image-list">
        {#each item.images as image, index}
          <ItemImage {image} {index} />
        {/each}
      </div>
      {#if item.references.length === 0}
        <div />
      {:else}
        <h4>Références :</h4>
        <ul>
          {#each item.references as ref, i}
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={ref}
                class="link">{formatRef(ref)}</a
              >
            </li>
          {/each}
        </ul>
      {/if}
    </Content>
    {#if canModif}
      <ActionIcons>
        <Wrapper>
          <Link to={"/item/" + item.categorie + "/" + item.id}>
            <IconButton class="material-icons">edit</IconButton>
          </Link>
          <Tooltip>Modifier</Tooltip>
        </Wrapper>
        <Wrapper>
          <IconButton
            on:click={deleteItem}
            class="material-icons red-icon-button">delete</IconButton
          >
          <Tooltip>Supprimer</Tooltip>
        </Wrapper>
      </ActionIcons>
    {/if}
  </Card>
</li>

<style>
  li {
    margin: 0 1.5em;
    padding-bottom: 0.5em;
  }

  p {
    margin: 0;
    margin-top: 0.5em;
  }

  h4 {
    margin: 0.5em;
    margin-top: 1em;
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

  @media (max-width: 768px) {
    .image-list {
      justify-content: center;
    }
  }

  a {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
