/*
 * @Author: your name
 * @Date: 2021-12-14 17:35:59
 * @LastEditTime: 2022-11-16 17:28:04
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Water-Marketing-System1\src\store\modules\settings.js
 */
/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */

import defaultSettings from "@/config/settings";

const { tagsBar, logo, layout, header, themeBar, skeleton } = defaultSettings;
const theme = JSON.parse(localStorage.getItem("BYUI-VUE-THEME")) || "";
const state = {
  tagsBar: theme.tagsBar || tagsBar,
  logo,
  collapse: false,
  OverallHeight: window.innerHeight - 270,
  layout: theme.layout || layout,
  header: theme.header || header,
  skeleton,
  device: "desktop",
  themeBar,
  isIndex:true, //是否为首页
  flag: false,
  OverallWidth: window.innerWidth - 90
};
const getters = {
  collapse: (state) => state.collapse,
  OverallHeight: (state) => state.OverallHeight,
  device: (state) => state.device,
  header: (state) => state.header,
  layout: (state) => state.layout,
  logo: (state) => state.logo,
  tagsBar: (state) => state.tagsBar,
  themeBar: (state) => state.themeBar,
  skeleton: (state) => state.skeleton,
  isIndex:(state) => state.isIndex,
  flag:(state) => state.flag,
  OverallWidth:(state) => state.OverallWidth
};
const mutations = {
  changeFlag:(state,status) => {
    state.flag = status;
  },
  changeIsIndex:(state,status)=>{
     state.isIndex = status;
  },
  changeLayout: (state, layout) => {
    if (layout) state.layout = layout;
  },
  changeHeader: (state, header) => {
    if (header) state.header = header;
  },
  changeTagsBar: (state, tagsBar) => {
    if (tagsBar) state.tagsBar = tagsBar;
  },
  changeCollapse: (state) => {
    state.collapse = !state.collapse;
  },
  changeOverallHeight: (state) => {
    state.OverallHeight = window.innerHeight - 220;
  },
  foldSideBar: (state) => {
    state.collapse = true;
  },
  openSideBar: (state) => {
    state.collapse = false;
  },
  toggleDevice: (state, device) => {
    state.device = device;
  },
  changeOverallWidth:(state,status) =>{
    // menu拉出后
    if(status){
      state.OverallWidth = window.innerWidth - 200;
    }else{
      state.OverallWidth = window.innerWidth - 86;
    }
    
  }
};
const actions = {
  changeOverallWidth({commit},val){
    commit('changeOverallWidth',val)
  },
  changeLayout({ commit }, layout) {
    commit("changeLayout", layout);
  },
  changeHeader({ commit }, header) {
    commit("changeHeader", header);
  },
  changeTagsBar({ commit }, tagsBar) {
    commit("changeTagsBar", tagsBar);
  },
  changeCollapse({ commit }) {
    commit("changeCollapse");
  },
  changeOverallHeight({ commit }) {
    commit("changeOverallHeight");
  },
  foldSideBar({ commit }) {
    commit("foldSideBar");
  },
  openSideBar({ commit }) {
    commit("openSideBar");
  },
  toggleDevice({ commit }, device) {
    commit("toggleDevice", device);
  },
};
export default { state, getters, mutations, actions };
