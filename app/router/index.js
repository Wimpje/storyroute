import App from "~/pages/App.vue";
import Home from "~/pages/Home.vue";
import Points from "~/pages/Points.vue";
import Route from "~/pages/Route.vue";
import Config from "~/pages/Config.vue";
import News from "~/pages/News.vue";
import TestGeo from "~/pages/TestGeo.vue";

const routes = {
  app: App,
  home: Home,
  points: Points,
  route: Route,
  config: Config,
  news: News,
  testGeo: TestGeo
};

// this is also ordered according to the tab-view :( - can't get it cooperating with sidedrawer, so 
const routeInfo = {
  routes: { icon: "0xf4d7", text: "Routes", page: routes.routes, isTabView: true, tabIndex: 0 },
  points: { icon: "0xf5a0", text: "Kaart", page: routes.points, isTabView: true, tabIndex: 1 },
  news: { icon: "0xf4d7", text: "News", page: routes.news, isTabView: true, tabIndex: 2 },
  testGeo: { icon: "0xf4d7", text: "Geo test", page: routes.testGeo, isTabView: false, isModal: true },
  config: { icon: "0xf4d7", text: "Config", page: routes.config, isTabView: false, isModal: true }
}

export {
  routes,
  routeInfo
}
