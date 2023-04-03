/*
 * @Author: xiaoHao
 */
/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
// import { asyncRoutes, constantRoutes } from "@/router";
// import { getRouterList } from "@/api/router";
// import { filterAllRoutes, filterAsyncRoutes } from "@/utils/handleRoutes";

const state = { };
const getters = { };
const mutations = { };
const actions = { };
// const getters = {

//   routes: (state) => state.routes,
//   partialRoutes: (state) => state.partialRoutes,
// };
// const mutations = {
//   setRoutes(state, routes) {
//     state.routes = constantRoutes.concat(routes);
//   },
//   setAllRoutes(state, routes) {
//     state.routes = constantRoutes.concat(routes);
//   },
//   setPartialRoutes(state, routes) {
//     state.partialRoutes = constantRoutes.concat(routes);
//   },
// };
// const actions = {
//   async setRoutes({ commit }, permissions) {
//     let accessedRoutes = [];
//     if (permissions.includes("admin")) {
//       accessedRoutes = asyncRoutes;
//     } else {
//       accessedRoutes = await filterAsyncRoutes(asyncRoutes, permissions);
//     }
//     commit("setRoutes", accessedRoutes);
//     return accessedRoutes;
//   },
//   async setAllRoutes({ commit }) {
//     let arr = {}
//     if (window.localStorage.getItem('routes') == 'undefined') {
//       arr = {}
//       var accessRoutes = [];
//       commit("setAllRoutes", accessRoutes);
//     } else {
//       arr = JSON.parse(window.localStorage.getItem('routes'))
//       var accessRoutes = filterAllRoutes(arr);
//       commit("setAllRoutes", accessRoutes);
//     }
//     return accessRoutes;
//     // let { data } = await getRouterList();
//     // data.push({ path: "*", redirect: "/404", hidden: true });
//   },
//   setPartialRoutes({ commit }, accessRoutes) {
//     commit("setPartialRoutes", accessRoutes);
//     return accessRoutes;
//   },
// };
export default { state, getters, mutations,actions };
