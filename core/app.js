/**
 * @file entry
 * @author zhengw(247276359@qq.com)
 */

import Vue from 'vue';
import Meta from 'vue-meta';
import VueWechatTitle from 'vue-wechat-title';


import {createRouter} from '@/.lavas/router';
import {createStore} from '@/.lavas/store';
import AppComponent from './App.vue';
import Vuetify from 'vuetify';

Vue.use(Meta);

Vue.use(Vuetify);
Vue.use(VueWechatTitle);
Vue.config.productionTip = false;

export function createApp() {
  let router = createRouter();
  let store = createStore();
  let App = Vue.extend({
    router,
    store,
    ...AppComponent
  });
  return {App, router, store};
}

if (module.hot) {
  module.hot.accept();
}
