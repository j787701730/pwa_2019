import axios from "axios";

const TANG_SHI = "tangShi";

export const state = () => ({
  books: []
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
      // TODO with error
      console.log("error in tangshi");
      console.log(e);
    }
  }
};
