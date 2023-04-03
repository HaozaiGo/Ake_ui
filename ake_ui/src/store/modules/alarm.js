/*
 * @Author: your name
 * @Date: 2021-05-20 15:38:33
 * @LastEditTime: 2021-05-20 16:17:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-meter-Reading\src\store\modules\alarm.js
 */
const state = {
  count: 0
}
const mutations = {
  increment: (state) => {
    state.count++
  }
}
const getters = {
  alarmChange: (state) => state.count
}
const actions = {
  increment: (context) => {
    context.commit('increment')
  }
}
export default { state, getters, mutations, actions };