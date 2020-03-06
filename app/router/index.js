import App from "~/pages/App.vue";
import Home from "~/pages/Home.vue";
import Points from "~/pages/Points.vue";
import Route from "~/pages/Route.vue";
import Config from "~/pages/Config.vue";
import News from "~/pages/News.vue";

const routes = {
  app: App,
  home: Home,
  points: Points,
  route: Route,
  config: Config,
  news: News,
};

const routeInfo = {
  home: { icon: "0xf4d7", text: "Home", page: routes.home },
  routes: { icon: "0xf4d7", text: "Routes", page: routes.routes },
  points: { icon: "0xf893", text: "Kaart", page: routes.points },
  news: { icon: "0xf4d7", text: "News", page: routes.news },
  config: { icon: "0xf4d7", text: "Config", page: routes.config }
}

export {
  routes,
  routeInfo
}
