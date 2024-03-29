import {login} from '@/services/index'
import {setToken, getToken} from '@/utils/index'
import { routerRedux } from 'dva/router';

export default {
  // 命名空间
  namespace: 'login',

  // 模块的状态
  state: {
    isLogin: -1
  },

   // 订阅
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname }) => {
        // 1.判断去的页面是否是登陆页面
        if (pathname.indexOf('/login') === -1) {
          // 1.1 判断是否有登陆态
          if (!getToken()){
            // 1.1.1没有登陆态，利用redux做路由跳转
            dispatch(routerRedux.replace({
              pathname: `/login`,
              search: `?redirect=${encodeURIComponent(pathname)}`
            }))
          }
        // 1.2用户没有登录态
        }else{
          // 1.2.1去登陆页面，如果已登陆跳回首页
          if (getToken()){
             // 利用redux做路由跳转
             dispatch(routerRedux.replace({
              pathname: `/`,
            }))
          }
        }
      });
    },
  },


  // 异步操作
  effects: {
    *login({ payload, type }, {call, put}){
      console.log('payload...', payload, type)
      let data = yield call(login, payload);
      console.log('data...', data);

      if (data.code == 1){
        // 1.设置cookie
        setToken(data.token)

      }

      // 调用reduce改变登陆状态
      yield put({
        type: 'updateLogin',
        payload: data.code
      })
    }
  },

  // 同步操作
  reducers: {
    updateLogin(state, action) {
      return { ...state, isLogin: action.payload };
    },
  },

};
