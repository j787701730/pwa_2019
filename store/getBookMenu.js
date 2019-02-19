import axios from "axios";

const GET_BOOK_MENU = "getBookMenu";

export const state = () => ({
  menu: []
});

export const mutations = {
  [GET_BOOK_MENU](state, menu) {
    state.menu = menu;
  }
};

export const actions = {
  async getBookMenu({commit}, id) {
    const params = new URLSearchParams();
    params.append('id', id);
    try {
      let result = await axios.post(`https://www.zhengw.top/getBook`, params);
      commit(GET_BOOK_MENU, result.data);
    } catch (e) {
      let menu = localStorage.getItem('bookmenu');
      let res = [];
      if (menu) {
        try {
          res = JSON.parse(menu);
          if (!Array.isArray(res)) {
            res = [];
          }
        } catch (e) {
          res = [];
        }
      }
      commit(GET_BOOK_MENU, res);
    }
  }
};
