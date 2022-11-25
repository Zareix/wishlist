<script lang="ts">
  import {
    dndzone,
    SOURCES,
    TRIGGERS,
    type DndEvent,
    type TransformDraggedElementFunction,
  } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import Button, { Label, Icon } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';

  type Link = { id: number; value: string };

  export let showThumbnail = false;
  export let links: Link[] = [];
  export let addNewLink: () => void;
  export let removeLink: (link: Link) => void;
  export let placeholder: string;
  export let title: string;
  export let addBtnText = placeholder;

  const flipDurationMs = 300;
  const dropTargetClasses = ['dnd-active'];
  let dragDisabled = true;

  const handleConsider = (e: CustomEvent<DndEvent<Link>>) => {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;
    links = newItems;
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  };

  const handleFinalize = (e: CustomEvent<DndEvent<Link>>) => {
    const {
      items: newItems,
      info: { source },
    } = e.detail;
    links = newItems;
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }
  };

  const startDrag = (e: CustomEvent<DndEvent<Link>>) => {
    e.preventDefault();
    dragDisabled = false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && dragDisabled)
      dragDisabled = false;
  };

  const transformDraggedElement: TransformDraggedElementFunction = (e) =>
    (e.className = 'dnd-item-active dnd-ref');

  const imageExists = (imageUrl: string) => imageUrl.startsWith('http');
</script>

{#if links.length > 0}
  <div class="separator" />
  <h4>{title} :</h4>
{/if}
<form
  class="links-list"
  on:submit={(e) => {
    e.preventDefault();
    addNewLink();
  }}
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
        style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
        on:mousedown={startDrag}
        on:touchstart={startDrag}
        on:keydown={handleKeyDown}>drag_indicator</Icon
      >
      <Textfield
        label={placeholder + ' ' + (links.indexOf(link) + 1)}
        bind:value={link.value}
      />
      <IconButton
        type="button"
        class="material-icons delete-link-btn"
        on:click={() => removeLink(link)}>delete</IconButton
      >
      {#if showThumbnail && imageExists(link.value)}
        <img
          src={link.value}
          alt={'thumbnail ' + links.indexOf(link)}
          class="thumbnail"
        />
      {/if}
    </div>
  {/each}
  <Button type="submit">
    <Icon class="material-icons">add</Icon>
    <Label>Ajouter une {addBtnText.toLowerCase()}</Label>
  </Button>
</form>

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

  @media (prefers-color-scheme: dark) {
    :global(.drag-icon),
    :global(.delete-links-btn) {
      color: #f9fafb;
    }
  }
</style>
