import axios from "axios";

/**
 * axios封装
 * @param url 调用地址
 * @param data 传入参数
 * @param toast 是否成功吐司
 * @param sucFun 成功回调函数
 * @param failFun 失败回调函数
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export function ajax(url, data, toast = true, sucFun = null, failFun = null) {
  const param = {
    url,
    method: 'post',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  };

  return axios(param).then(
    (res) => {
      if (res.data.err_code === 0) {
        if (toast) {
          //Feedback.toast.success(res.data.err_msg);
        }
        if (sucFun !== null) {
          sucFun(res.data);
        }
      } else if (res.data.err_code === 88888) { // 登录处理
        // const history = createHashHistory();
        history.push('/user/login');
      } else {
        // if (toast) {
        //Feedback.toast.error(res.data.err_msg);
        // }
        if (failFun !== null) {
          failFun(res.data);
        }
      }
    }
  ).catch(
    () => {
      // if (toast) {
      //Feedback.toast.error('请求失败');
      // }
      if (failFun !== null) {
        failFun();
      }
    }
  );
}
