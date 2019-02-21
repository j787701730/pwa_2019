import {SET_APP_HEADER} from "./appHeader";

/**
 * @file appShell/appSidebar module
 * @author lavas
 */

export const SET_SIDEBAR_VISIBILITY = 'SET_SIDEBAR_VISIBILITY';
export const SET_SIDEBAR_DATA = 'SET_SIDEBAR_Data';

export const state = () => {
  return {
    show: false, // 是否显示sidebar

    // 头部条的相关配置
    title: {
      imageLeft: '',
      altLeft: '',
      iconLeft: 'home',
      text: 'Home',
      imageRight: '',
      altRight: '',
      iconRight: '',
      route: '/'
    },

    // user: {
    //     name: 'Lavas',
    //     email: 'lavas@baidu.com',
    //     location: 'Shanghai'
    // },

    // 分块组
    blocks: [
      {
        // 子列表1
        // sublistTitle: 'Sublist1',
        list: [
          {
            text: 'Detail Page 1',
            icon: 'sentiment_satisfied',
            route: '/detail/1'
          },
          {
            text: 'Detail Page 2',
            icon: 'sentiment_satisfied',
            alt: 'mood-bad',
            route: '/detail/2'
          },
          {
            text: 'Detail Page 3',
            icon: 'sentiment_neutral',
            route: '/detail/3'
          }
        ]
      }
    ]
  };
};

export const mutations = {
  [SET_SIDEBAR_VISIBILITY](state, sidebarVisibility) {
    state.show = sidebarVisibility;
  }, [SET_SIDEBAR_DATA](state, sidebarData) {
    state = Object.assign(state, sidebarData);
  },
};

export const actions = {

  /**
   * 展示侧边栏
   *
   * @param {Function} commit commit
   */
  showSidebar({commit}) {
    commit(SET_SIDEBAR_VISIBILITY, true);
  },

  /**
   * 隐藏侧边栏
   *
   * @param {Function} commit commit
   */
  hideSidebar({commit}) {
    commit(SET_SIDEBAR_VISIBILITY, false);
  },
  /**
   * 设置侧边栏
   *
   * @param {Function} commit commit
   * @param {Object} sidebarData sidebarData
   */
  setAppSiderBar({commit}, sidebarData) {
    commit(SET_SIDEBAR_DATA, sidebarData);
  }
};
