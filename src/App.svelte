<script>
  import { Router, Route } from "svelte-routing"

  import Home from "./routes/Home.svelte"
  import Login from "./routes/Login.svelte"
  import Config from "./routes/Config.svelte"
  import AddItem from "./routes/AddItem.svelte"
  import ProtectedRoutes from "./routes/ProtectedRoutes.svelte"
  import Archive from "./routes/Archive.svelte"

  export let url = ""
</script>

<Router {url}>
  <Route path="login" component={Login} />
  <ProtectedRoutes path="settings" component={Config} />
  <ProtectedRoutes path="archive" component={Archive} />
  <ProtectedRoutes path="add" component={AddItem} />
  <ProtectedRoutes path="item/:oldCategorie/:modifId" component={AddItem} />
  <ProtectedRoutes path="/" component={Home} />
</Router>

<style>
</style>
