<script>
  import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action"
  import { flip } from "svelte/animate"
  import Button, { Label, Icon } from "@smui/button"
  import IconButton from "@smui/icon-button"
  import Textfield from "@smui/textfield"

  export let showThumbnail
  export let links = []
  export let addNewLink
  export let removeLink

  export let placeholder
  export let title
  export let addBtnText = placeholder

  const flipDurationMs = 300
  const dropTargetClasses = ["dnd-active"]
  let dragDisabled = true

  const handleConsider = (e) => {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail
    links = newItems
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true
    }
  }

  const handleFinalize = (e) => {
    const {
      items: newItems,
      info: { source },
    } = e.detail
    links = newItems
    if (source === SOURCES.POINTER) {
      dragDisabled = true
    }
  }

  const startDrag = (e) => {
    e.preventDefault()
    dragDisabled = false
  }

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && dragDisabled)
      dragDisabled = false
  }

  const transformDraggedElement = (e) => (e.className = "dnd-item-active")

  const imageExists = (image_url) => image_url.startsWith("http")
</script>

{#if links.length > 0}
  <div class="separator" />
  <h4>{title} :</h4>
{/if}
<section
  class="links-list"
  use:dndzone={{
    items: links,
    flipDurationMs,
    type: title.toLowerCase(),
    dropTargetClasses,
    dropFromOthersDisabled: true,
    transformDraggedElement,
    dragDisabled,
  }}
  on:consider={handleConsider}
  on:finalize={handleFinalize}
>
  {#each links as link (link.id)}
    <div class="flex" animate:flip={{ duration: flipDurationMs }}>
      <Icon
        class="material-icons drag-icon"
        tabindex={dragDisabled ? 0 : -1}
        aria-label="drag-handle"
        style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
        on:mousedown={startDrag}
        on:touchstart={startDrag}
        on:keydown={handleKeyDown}>drag_indicator</Icon
      >
      <Textfield
        label={placeholder + " " + (links.indexOf(link) + 1)}
        bind:value={link.value}
      >
        <IconButton
          class="material-icons delete-link-btn"
          slot="trailingIcon"
          on:click={() => removeLink(link)}>delete</IconButton
        >
      </Textfield>
      {#if showThumbnail && imageExists(link.value)}
        <img
          src={link.value}
          alt={"thumbnail " + links.indexOf(link)}
          class="thumbnail"
        />
      {/if}
    </div>
  {/each}
</section>
<Button type="button" on:click={addNewLink}>
  <Icon class="material-icons">add</Icon>
  <Label>Ajouter une {addBtnText.toLowerCase()}</Label>
</Button>

<style>
  .links-list {
    margin-left: 0.5em;
    margin-bottom: 0.125em;
  }

  .flex {
    align-items: center;
  }

  :global(.drag-icon) {
    cursor: grab;
  }

  .thumbnail {
    max-width: 25%;
    max-height: 5rem;
    margin-left: 0.5rem;
  }

  :global(.dnd-active) {
    outline: none !important;
  }

  :global(.dnd-item-active) {
    outline: none !important;
  }

  @media (prefers-color-scheme: dark) {
    :global(.drag-icon),
    :global(.delete-links-btn) {
      color: #f9fafb;
    }
  }
</style>
