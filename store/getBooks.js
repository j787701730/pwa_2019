import axios from "axios";

const SET_WEATHER = "setWeather";

export const state = () => ({
  books: []
});

export const mutations = {
  [SET_WEATHER](state, books) {
    state.books = books;
  }
};

export const actions = {
  async setWeather({commit}) {
    try {
      let url = `https://www.zhengw.top/getbooks`;
      let result = await axios(url);
      commit(SET_WEATHER, result.data);
    } catch (e) {
      let books = localStorage.getItem('books');
      let res = [];
      if (books) {
        try {
          res = JSON.parse(books);
          if (!Array.isArray(res)) {
            res = [];
          }
        } catch (e) {
          res = [];
        }
      }
      commit(SET_WEATHER, res);
    }
  }
};
