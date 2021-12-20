<script>
  import { user } from "../stores"
  import { auth } from "../firebase"

  import { Link } from "svelte-routing"
  import IconButton from "@smui/icon-button"

  export let active = ""

  const logout = async () => {
    await auth.signOut()
    user.set(null)
    location.reload()
  }
</script>

<nav>
  <ul>
    <li class={active === "home" ? " active" : ""}>
      <Link to="/" class="nav-link">
        <IconButton class="nav-icon material-icons-outlined">home</IconButton>
        <span>Accueil</span>
      </Link>
    </li>

    <li class={active === "archive" ? " active" : ""}>
      <Link to="/archive" class="nav-link">
        <IconButton class="nav-icon material-icons-outlined">archive</IconButton
        >
        <span>Archive</span>
      </Link>
    </li>

    <li class={active === "add" ? " active" : ""}>
      <Link to="/add" class="nav-link">
        <IconButton class="nav-icon material-icons-outlined">add</IconButton>
        <span>Ajouter</span>
      </Link>
    </li>

    <li class={active === "settings" ? " active" : ""}>
      <Link to="/settings" class="nav-link">
        <IconButton class="nav-icon material-icons-outlined"
          >settings</IconButton
        >
        <span>Paramètres</span>
      </Link>
    </li>

    <li>
      <div on:click={logout} class="nav-link">
        <IconButton class="nav-icon material-icons-outlined">logout</IconButton>
        <span>Déconnexion</span>
      </div>
    </li>

    <div class="indicator">
      <div class="indicator-circle" />
    </div>
  </ul>
</nav>

<style>
  :global(#navTitle) {
    max-width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: white;
  }

  nav {
    z-index: 500;
    position: fixed;
    inset: 0;
    top: auto;
    bottom: 0;
    margin: 0 auto;
    width: clamp(15rem, 85vw, 30rem);
    height: 3rem;
    padding: 0.25rem 1rem 0.6rem 1rem;
    box-shadow: 0px 7px 10px 4px rgba(0, 0, 0, 0.1);
    border-radius: 12px 12px 0 0;
    background-color: var(--background-secondary);
  }

  ul {
    position: relative;
    margin: 0;
    width: 100%;
    list-style: none;
    display: flex;
    align-items: center;
  }

  li {
    width: 20%;
  }

  :global(.nav-icon) {
    overflow: hidden;
    border-radius: 50%;
    padding: 0;
    margin: auto;
  }

  :global(.nav-link) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :global(.mdc-icon-button) {
    z-index: 102;
    height: 3rem;
    width: 3rem;
  }

  @keyframes icon {
    100% {
      transform: translateY(-50%);
      color: white;
    }
  }

  li.active :global(.mdc-icon-button) {
    animation: icon 0.5s forwards;
  }

  @keyframes text {
    100% {
      transform: translateY(10px);
      opacity: 1;
    }
  }

  span {
    position: absolute;
    font-size: 0.9rem;
    opacity: 0;
  }

  li.active span {
    animation: text 0.5s forwards;
  }

  @keyframes indicator-circle {
    100% {
      width: 3rem;
      height: 3rem;
    }
  }

  .indicator {
    z-index: 101;
    position: absolute;
    bottom: 50%;
    width: 20%;
    height: 100%;
    display: flex;
    align-items: end;
    justify-content: center;
  }

  .indicator-circle {
    width: 0;
    height: 0;
    border-radius: 50%;
    background-color: var(--green);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    animation: indicator-circle 0.5s forwards;
  }

  li:nth-child(1).active ~ .indicator {
    left: 0%;
  }

  li:nth-child(2).active ~ .indicator {
    left: 20%;
  }

  li:nth-child(3).active ~ .indicator {
    left: 40%;
  }

  li:nth-child(4).active ~ .indicator {
    left: 60%;
  }

  @media (prefers-color-scheme: dark) {
    nav {
      background-color: rgb(23, 32, 51);
      box-shadow: 0px 10px 14px 5px rgba(50, 50, 50, 0.1);
    }
  }
</style>
