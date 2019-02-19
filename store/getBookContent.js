import axios from "axios";

const GET_BOOK_CONTENT = "getBookContent";

export const state = () => ({
  content: []
});

export const mutations = {
  [GET_BOOK_CONTENT](state, content) {
    state.content = content;
  }
};

export const actions = {
  async getBookContent({commit}, data) {
    const params = new URLSearchParams();
    params.append('id', data.books_id);
    params.append('books_id', data.id);
    try {
      let result = await axios.post(`https://www.zhengw.top/getContent`, params);
      commit(GET_BOOK_CONTENT, result.data);
    } catch (e) {
      let content = localStorage.getItem('bookcontent');
      let res = [];
      if (content) {
        try {
          res = JSON.parse(content);
          if (!Array.isArray(res)) {
            res = [];
          }
        } catch (e) {
          res = [];
        }
      }
      commit(GET_BOOK_CONTENT, res);
    }
  }
};
