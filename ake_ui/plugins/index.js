


import akeTable from './components/akeTable/akeTable.vue';
import akeTable2 from './components/akeTable/akeTable2.vue';
import akeTable3 from './components/akeTable/akeTable3.vue';
import akeTable3S from './components/akeTable/akeTable3-special.vue';
import akeForm from './components/akeForm/akeForm.vue';
import akeFormItem from './components/akeForm/akeFormItem.vue';
import printTable from './components/print/printTable.vue';

const components = [akeTable, akeTable2, akeTable3, akeTable3S, akeForm, akeFormItem, printTable];
/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
const install = Vue => {
    if(install.installed) return;
    install.installed = true;


//注册组件
  components.map(component => {
    Vue.component(component.name, component);

  });
}

if(typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
    install,
    ...components
}