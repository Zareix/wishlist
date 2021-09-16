<script>
  import { onMount } from "svelte"
  import { db } from "../firebase"
  import { user } from "../stores"

  import { flip } from "svelte/animate"
  import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action"

  import IconButton from "@smui/icon-button"
  import { Icon } from "@smui/button"

  import Item from "./Item.svelte"

  let currentUser
  const unsubcribe2 = user.subscribe((v) => (currentUser = v))

  const flipDurationMs = 300
  const dropTargetClasses = ["dnd-active"]
  let dragDisabled = true

  export let category
  export let choosenUser
  export let snackbarOpen
  export let orderByPosition

  let oldUser
  let items = []
  let catPrice = 0
  let upPosTimeoutId
  const collapsible =
    "collapsibleContainer" +
    category.charAt(0).toUpperCase() +
    category.slice(1).replace(" ", "") +
    Math.random() * 100
  let collapsed = true

  onMount(() => {
    oldUser = choosenUser
  })

  $: if (oldUser !== choosenUser) {
    fetchData()
    oldUser = choosenUser
  }

  $: canModif = currentUser.email === choosenUser

  const fetchData = async () => {
    items = []
    await db
      .collection(choosenUser)
      .doc("items")
      .collection(category)
      .orderBy(orderByPosition ? "position" : "createdAt")
      .get()
      .then((data) => {
        data.forEach((i) => {
          let price = i.data().price
          if (price) catPrice += price
          addItems({ id: i.id, categorie: category, ...i.data() })
        })
      })
  }

  const addItems = (i) => (items = [...items, i])

  const removeItem = (item) => {
    items = items.filter((i) => i !== item)
    snackbarOpen('"' + item.title + '" placé dans les archives')
  }

  const updatePosition = () => {
    const batch = db.batch()
    items.forEach((item, index) => {
      batch.update(
        db
          .collection(choosenUser)
          .doc("items")
          .collection(category)
          .doc(item.id),
        { position: index }
      )
    })
    batch.commit()
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
    else element.style.maxHeight = 300 * items.length + "px"

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
      class={"category-header" + (collapsed ? "" : " sticky")}
      on:click={collapse}
    >
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
          <div animate:flip={{ duration: flipDurationMs }}>
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
          </div>
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

  .category {
    width: 80%;
    margin: 1rem auto 2.5rem auto;
    transition: border 1s ease;
    border-bottom: solid 1px;
    border-color: rgba(163, 163, 163, 0);
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

  .category-header::before {
    content: "";
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
    padding: 0 1.5rem;
  }

  .collapsible {
    transition: max-height 1s ease;
    overflow: hidden;
  }

  .collapsed .item-list {
    max-height: 0px;
  }

  :global(.chevron) {
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
