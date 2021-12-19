<script>
  import { onDestroy, onMount } from "svelte"

  import { db9 } from "../firebase"
  import { user } from "../stores"

  import { flip } from "svelte/animate"
  import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action"

  import IconButton from "@smui/icon-button"
  import { Icon } from "@smui/button"
  import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    writeBatch,
  } from "@firebase/firestore"

  import Item from "./Item.svelte"

  let currentUser
  const unsubscribe = user.subscribe((v) => (currentUser = v))

  const flipDurationMs = 300
  const dropTargetClasses = ["dnd-active"]
  let dragDisabled = true

  export let category
  export let chosenUser
  export let snackbarOpen
  export let orderByPosition
  export let hidden

  let oldUser
  let items = []
  let upPosTimeoutId
  const collapsible =
    "collapsibleContainer" +
    category.charAt(0).toUpperCase() +
    category.slice(1).replace(" ", "") +
    Math.random() * 100
  let collapsed = true

  onDestroy(() => unsubscribe())

  onMount(() => {
    oldUser = chosenUser
  })

  $: if (oldUser !== chosenUser) {
    fetchData()
    oldUser = chosenUser
  }

  $: canModif = currentUser.email === chosenUser

  $: catPrice =
    Math.floor(items.reduce((x, y) => x + (y.price ? y.price : 0), 0) * 100) /
    100

  const fetchData = async () => {
    items = []

    const res = await getDocs(
      query(
        collection(db9, chosenUser, "items", category),
        orderBy(orderByPosition ? "position" : "createdAt")
      )
    )

    res.forEach((i) => {
      addItems({ id: i.id, categorie: category, ...i.data() })
    })
  }

  const addItems = (i) => (items = [...items, i])

  const removeItem = (item) => {
    items = items.filter((i) => i !== item)
    snackbarOpen('"' + item.title + '" placé dans les archives')
  }

  const updatePosition = async () => {
    const batch = writeBatch(db9)

    items.forEach((item, index) => {
      batch.update(doc(db9, chosenUser, "items", category, item.id), {
        position: index,
      })
    })
    await batch.commit()
  }

  const handleDndConsider = (e) => {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail
    items = newItems
    if (upPosTimeoutId) {
      clearTimeout(upPosTimeoutId)
      upPosTimeoutId = undefined
    }
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true
    }
  }

  const handleDndFinalize = (e) => {
    const {
      items: newItems,
      info: { source },
    } = e.detail
    items = newItems
    upPosTimeoutId = setTimeout(updatePosition, 3000)
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

  const collapse = () => {
    const element = document.getElementById(collapsible)

    if (!collapsed) element.style.maxHeight = null
    else element.style.maxHeight = 400 * items.length + "px"

    collapsed = !collapsed
  }
</script>

{#if items.length !== 0}
  <section
    id={"category" +
      category.charAt(0).toUpperCase() +
      category.slice(1).replace(" ", "")}
    class={"category" + (collapsed ? " collapsed" : "")}
  >
    <div
      class={"category-header" +
        (collapsed ? "" : " sticky") +
        (hidden ? " hidden" : "")}
      on:click={collapse}
    >
      {#if hidden}
        <div class="material-icons hidden-icon">visibility_off</div>
      {/if}
      <div class="category-header-content">
        <h2>{category}</h2>
        {#if catPrice !== 0}
          <p class="text-gray price">Prix total : {catPrice} €</p>
        {/if}
      </div>
      <IconButton
        class={"material-icons chevron" + (collapsed ? " chevron-active" : "")}
        >expand_more</IconButton
      >
    </div>

    {#if items.length > 1 && canModif}
      <ul
        class="item-list collapsible"
        id={collapsible}
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
                style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
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
      <ul class="item-list collapsible" id={collapsible}>
        {#each items as item (item.id)}
          <Item
            index={items.indexOf(item)}
            {item}
            {removeItem}
            {canModif}
            {category}
          />
        {/each}
      </ul>
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
    width: 80%;
    margin: 1rem auto 2.5rem auto;
    transition: border-color 0.5s ease;
    border-bottom: solid 1px;
    border-color: rgba(163, 163, 163, 0);
    animation: fadeIn 1s ease forwards;
  }

  .category-header {
    z-index: 25;
    width: max-content;
    margin: 0 auto;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    border-radius: 12px;
    background-color: var(--mdc-theme-background);
    transition: box-shadow 250ms ease;

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
    box-shadow: 0px 7px 10px 4px rgba(0, 0, 0, 0.05);
  }

  .category-header-content {
    text-align: center;
  }

  .category-header:not(.hidden)::before {
    content: "";
    width: 24px;
    height: 24px;
    margin: 12px;
  }

  .hidden-icon {
    width: 24px;
    height: 24px;
    margin: 12px;
  }

  .category.collapsed:not(:nth-last-child(2)) {
    border-color: rgba(163, 163, 163, 0.6);
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
  }

  .item-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-inline: 1rem;
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
    animation: fadeIn 250ms 0.5s linear forwards;
    transition: transform 500ms ease;
  }

  :global(.chevron-active) {
    transform: rotate(180deg);
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
  }
</style>
