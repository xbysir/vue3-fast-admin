import { createApp } from "vue";
import App from "./App.vue";
import store from "@/store";
// load
import { loadSvg } from "@/icons";
import { loadPlugins } from "@/plugins";
// css
import "normalize.css";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

import "@/styles/index.scss";
//router
import router from "./router/index";

const app = createApp(App);
// 加载插件
loadPlugins(app);
//加载全局 SVG
loadSvg(app);
app.use(store);
app.use(router);
app.mount("#app");
