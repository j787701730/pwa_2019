import axios from "axios";

const TANG_SHI = "tangShi";

export const state = () => ({
  tangShis: []
});

export const mutations = {
  [TANG_SHI](state, tangShis) {
    state.tangShis = tangShis;
  }
};

export const actions = {
  async tangShi({commit}) {
    try {
      let url = 'https://www.zhengw.top/Index-tangshi';
      let result = await axios(url);
      commit(TANG_SHI, result.data);
    } catch (e) {
      let tangShis = localStorage.getItem('tangShis');
      let res = [];
      if (tangShis) {
        try {
          res = JSON.parse(tangShis);
          if (!Array.isArray(res)) {
            res = [];
          }
        } catch (e) {
          res = [];
        }
      }
      commit(TANG_SHI, res);
    }
  }
};
