import axios from "axios";

const GET_CONTENT_BOOK_MENU = "getContentBookMenu";

export const state = () => ({
  menu: []
});

export const mutations = {
  [GET_CONTENT_BOOK_MENU](state, menu) {
    state.menu = menu;
  }
};

export const actions = {
  async getContentBookMenu({commit}, id) {
    const params = new URLSearchParams();
    params.append('id', id);
    try {
      let result = await axios.post(`https://www.zhengw.top/getBook`, params);
      commit(GET_CONTENT_BOOK_MENU, result.data);
    } catch (e) {
      let menu = localStorage.getItem('contentbookmenu');
      let res = [];
      if (menu) {
        try {
          res = JSON.parse(menu);
        } catch (e) {
          res = [];
        }
      }
      commit(GET_CONTENT_BOOK_MENU, res);
    }
  }
};
