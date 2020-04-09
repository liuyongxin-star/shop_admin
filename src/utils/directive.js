import Vue from 'vue'

//  v-number-input  
function onInput(el, ele, binding, vnode) {
    function handle() {
    // 只保留数字
    ele.value = ele.value.replace(/[^\d]/g, '')
    }
    return handle
} 
const numberInput={
    bind(el,binding,vnode){
        const ele=el.tagName=='INPUT'?el:el.querySelector('input')
        ele.addEventListener('input',onInput(el,ele,binding,vnode),false)
    }
}
Vue.directive('number-input',numberInput);