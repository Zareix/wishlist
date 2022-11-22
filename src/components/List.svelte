<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { db9 } from '../firebase';
  import { user } from '../stores';

  import { flip } from 'svelte/animate';
  import { dndzone, SOURCES, TRIGGERS, type DndEvent } from 'svelte-dnd-action';

  import IconButton from '@smui/icon-button';
  import { Icon } from '@smui/button';
  import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    writeBatch,
  } from '@firebase/firestore';

  import type { Item as ModelItem } from '../models/Item';
  import Item from './Item.svelte';
  import type { User } from 'firebase/auth';

  let currentUser: User;
  const unsubscribe = user.subscribe((v) => (currentUser = v));

  const flipDurationMs = 300;
  const dropTargetClasses = ['dnd-active'];
  let dragDisabled = true;

  export let category: string;
  export let chosenUser: string;
  export let snackbarOpen: (message: string) => void;
  export let orderByPosition: boolean;
  export let hidden: boolean;

  let oldUser: string;
  let items: ModelItem[] = [];
  let upPosTimeoutId: NodeJS.Timeout;
  let collapsed = true;
  let catSection: HTMLElement;
  let collapsibleUl: HTMLDivElement;

  onDestroy(() => unsubscribe());

  onMount(() => {
    oldUser = chosenUser;
  });

  $: if (oldUser !== chosenUser) {
    fetchData();
    oldUser = chosenUser;
  }

  $: canModif = currentUser.email === chosenUser;

  $: catPrice =
    Math.floor(items.reduce((x, y) => x + (y.price ? y.price : 0), 0) * 100) /
    100;

  const fetchData = async () => {
    items = [];

    const res = await getDocs<ModelItem>(
      query<ModelItem>(
        collection(db9, chosenUser, 'items', category),
        orderBy(orderByPosition ? 'position' : 'createdAt')
      )
    );

    res.forEach((i) => {
      addItems({ id: i.id, categorie: category, ...i.data() });
    });
  };

  const addItems = (i: ModelItem) => (items = [...items, i]);

  const removeItem = (item: ModelItem) => {
    items = items.filter((i) => i !== item);
    snackbarOpen('"' + item.title + '" placé dans les archives');
  };

  const updatePosition = async () => {
    const batch = writeBatch(db9);

    items.forEach((item, index) => {
      batch.update(doc(db9, chosenUser, 'items', category, item.id), {
        position: index,
      });
    });
    await batch.commit();
  };

  const handleDndConsider = (e: CustomEvent<DndEvent<ModelItem>>) => {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;
    items = newItems;
    if (upPosTimeoutId) {
      clearTimeout(upPosTimeoutId);
      upPosTimeoutId = undefined;
    }
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  };

  const handleDndFinalize = (e: CustomEvent<DndEvent<ModelItem>>) => {
    const {
      items: newItems,
      info: { source },
    } = e.detail;
    items = newItems;
    upPosTimeoutId = setTimeout(updatePosition, 3000);
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }
  };

  const startDrag = (e: CustomEvent<DndEvent<ModelItem>>) => {
    e.preventDefault();
    dragDisabled = false;
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && dragDisabled)
      dragDisabled = false;
  };

  const transformDraggedElement = (e: HTMLElement) =>
    (e.className = 'dnd-item-active');

  const collapse = () => {
    catSection.scrollIntoView({
      behavior: 'smooth',
    });

    if (!collapsed) collapsibleUl.style.maxHeight = '0';
    else collapsibleUl.style.maxHeight = 400 * items.length + 'px';

    collapsed = !collapsed;
  };
</script>

{#if items.length !== 0}
  <section
    id={'category_' + category.toLowerCase().replaceAll(' ', '')}
    bind:this={catSection}
    class={'category' + (collapsed ? ' collapsed' : '')}
  >
    <div
      class={'category-header' +
        (collapsed ? '' : ' sticky') +
        (hidden ? ' hidden' : '')}
      on:click={collapse}
      on:keypress={collapse}
    >
      {#if hidden}
        <div class="material-icons hidden-icon">visibility_off</div>
      {/if}
      <div class="category-header-content">
        <h2>{category}</h2>
        {#if catPrice !== 0 && !hidden}
          <p class="text-gray price">Prix total : {catPrice} €</p>
        {/if}
      </div>
      <IconButton
        class={'material-icons chevron' + (collapsed ? ' chevron-active' : '')}
        >expand_more</IconButton
      >
    </div>

    {#if items.length > 1 && canModif}
      <ul
        class="item-list collapsible"
        bind:this={collapsibleUl}
        use:dndzone={{
          items,
          flipDurationMs,
          type: category,
          dropTargetClasses,
          dropFromOthersDisabled: true,
          transformDraggedElement: transformDraggedElement,
          dragDisabled,
        }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
      >
        {#each items as item (item.id)}
          <li animate:flip={{ duration: flipDurationMs }}>
            <div class="drag-icon-item-wrapper">
              <Icon
                class="material-icons drag-icon-item"
                tabindex={dragDisabled ? 0 : -1}
                aria-label="drag-handle"
                style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
                on:mousedown={startDrag}
                on:touchstart={startDrag}
                on:keydown={handleKeyDown}>drag_indicator</Icon
              >
            </div>
            <Item
              index={items.indexOf(item)}
              {item}
              {removeItem}
              {canModif}
              {category}
            />
          </li>
        {/each}
      </ul>
    {:else}
      <div class="item-list collapsible" bind:this={collapsibleUl}>
        {#each items as item (item.id)}
          <Item
            index={items.indexOf(item)}
            {item}
            {removeItem}
            {canModif}
            {category}
          />
        {/each}
      </div>
    {/if}
  </section>
{/if}

<style>
  .drag-icon-item-wrapper {
    position: relative;
    margin-bottom: -24px;
    top: 0.5rem;
    left: calc(50% - 12px);
    width: fit-content;
  }

  :global(.drag-icon-item) {
    transform: rotate(90deg);
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 100%;
    }
  }

  .category {
    position: relative;
    width: 80%;
    margin: 1rem auto;
    transition: border-color 0.5s ease;
    animation: fadeIn 1s ease forwards;

    border: 1px solid rgb(0 0 0 / 0.2);
    border-radius: 12px;
  }

  .category-header {
    z-index: 25;
    width: max-content;
    margin: 0.5rem auto;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    border-radius: 12px;
    background-color: var(--mdc-theme-background);
    transition: box-shadow 250ms ease, background-color 250ms ease;

    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .category-header.sticky {
    position: sticky;
    top: 5rem;
    background-color: var(--background-secondary);
    box-shadow: 0px 7px 10px 4px rgba(0, 0, 0, 0.05);
  }

  .category-header-content {
    text-align: center;
  }

  .category-header:not(.hidden)::before {
    content: '';
    width: 24px;
    height: 24px;
    margin: 12px;
  }

  .hidden-icon {
    width: 24px;
    height: 24px;
    margin: 12px;
  }

  h2 {
    text-transform: capitalize;
  }

  .price {
    font-weight: 500;
    font-size: large;
    margin: 0;
  }

  ul {
    list-style: none;
    margin-bottom: 0;
  }

  .category.collapsed .item-list {
    margin: 0;
  }

  .item-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-inline: 1rem;
  }

  .item-list {
    margin-top: 1rem;
  }

  .collapsible {
    transition: all 1s ease;
    overflow: hidden;
  }

  :not(.collapsed) .item-list {
    padding-bottom: 1rem;
  }

  .collapsed .item-list {
    max-height: 0;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  :global(.chevron) {
    opacity: 0;
    transform: rotate(180deg);
    animation: fadeIn 250ms 1s linear forwards;
    transition: transform 500ms ease;
  }

  :global(.chevron-active) {
    transform: rotate(0);
  }

  @media (max-width: 768px) {
    .category {
      width: 90vw;
    }
  }

  @media (prefers-color-scheme: dark) {
    .price {
      color: var(--gray-light);
    }

    .category {
      border: 2px solid rgb(255 255 255 / 0.25);
    }
  }
</style>
