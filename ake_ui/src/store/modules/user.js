/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from "vue";
// import { getInfo, login, logout } from "@/api/user";
// import { getToken, removeToken, setToken } from "@/utils/auth";
// import {
//   getAccessToken,
//   removeAccessToken,
//   setAccessToken,
// } from "@/utils/accessToken";
// import { resetRouter } from "@/router";
import { title, tokenName } from "@/config/settings";
// import { encrypt } from "@/utils/encrypt";

const state = {
  // accessToken: getAccessToken(),
  userName: "",
  nickName: "",
  avatar: "",
  permissions: [],
};
const getters = {
  accessToken: (state) => state.accessToken,
  userName: (state) => state.userName,
  nickName: (state) => state.nickName,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
};

const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
    setAccessToken(accessToken);
  },
  setUserName(state, userName) {
    state.userName = userName;
  },
  setNickName(state, nickName) {
    state.nickName = nickName;
  },
  setAvatar(state, avatar) {
    state.avatar = avatar;
  },
  setPermissions(state, permissions) {
    state.permissions = permissions;
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  },
};
const actions = {
  // 登录
  Login({ commit }, userInfo) {
    const username = userInfo.username.trim();
    const password = encrypt(userInfo.password);
    const code = userInfo.code;
    const uuid = userInfo.uuid;
    userInfo.password = password;
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then((res) => {
          if (res.code == 500) {
            Vue.prototype.$baseMessage(res.msg, "warning");
            reject(res);
            return;
          }
          window.localStorage.setItem("user_id", res.user_id);
          window.localStorage.setItem("expires_in", res.expires_in);
          setToken(res.token);
          window.localStorage.setItem("refresh_token", res.refresh_token);
          window.localStorage.setItem("token", res.token);
          window.localStorage.setItem("client_id", "web");
          commit("SET_TOKEN", res.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async getInfo({ commit, state }) {
    const data = await getInfo(state.accessToken);
    window.localStorage.setItem("nickName", data.user.nickName);
    localStorage.setItem("user_id", data.user.userId);
    localStorage.setItem("deptId", data.user.deptId);

    if (!data) {
      // Vue.prototype.$baseMessage("验证失败，请重新登录...", "error");
      removeToken();
      return false;
    }
    let { userName, avatar, nickName } = data.user;
    let { permissions } = data;
    if (permissions.length == 0) {
      permissions = ["noPermissions"];

      // Vue.prototype.$baseMessage("请联系管理员开通菜单权限", "warning");
    }
    if (permissions[0] == "*:*:*") {
      window.localStorage.setItem("PerBtn", "admin");
    } else {
      window.localStorage.setItem("PerBtn", JSON.stringify(permissions));
    }
    if (permissions && userName) {
      commit("setPermissions", permissions);
      commit("setUserName", userName);
      commit("setNickName", nickName);
      commit("setAvatar", avatar);
      return permissions;
    } else {
      Vue.prototype.$baseMessage("获取用户信息接口异常", "error");
      removeToken();
      return;
    }
  },
  // 退出系统
  async logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          commit("SET_PERMISSIONS", []);
          removeToken();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  resetAccessToken({ commit }) {
    commit("setPermissions", []);
    commit("setAccessToken", "");
    removeAccessToken();
  },
};
export default { state, getters, mutations, actions };
