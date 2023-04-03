<template>
  <div id="app">
   
  </div>
</template>

<script>

import akeTable from '~/components/akeTable/akeTable.vue'
import akeFormItem from '~/components/akeForm/akeFormItem.vue';

export default {
  name: 'App',
  components: {
    akeTable,akeFormItem
  },
  data(){
    return{
      
    }
  },
mounted(){
 
},
}
</script>

<style>
#app {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
