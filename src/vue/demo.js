Vue.component('foo', {
  props: ['a', 'b'],
  data: function () {
    return {list: [1,2,3,4,5]}
  },
  render: function () {
    with (this) { return __h__('div', undefined, [(list)&&__renderList__((list), function(k, v,$index){return __h__('div', {class:[a, 'a'],style:{m: '1', n: a},attrs:{"n":a},staticAttrs:{"m":"a","style":"l: 2"}}, [("\n aaa"+__toString__(a)+"bbb"+__toString__(k)+"-"+__toString__(v)+"\n "),_staticTrees[0]], '')})], '')}
  },
  staticRenderFns: [
    function () {
      with(this){return __h__('div', undefined, ["Hello World"], '')}
    }
  ]
})

new Vue({
  el: '#app',
  data: {x: 1, y: 2, z: 'foo'},
  style: {y: {fontSize: 64}},
  render: function () {
    with (this) { return __h__('div', {staticAttrs:{"id":"app"}}, [__h__('foo', {attrs:{"a":x,"b":y}}, undefined, '')," ",__h__(z, {}, undefined)," ",__h__('text', {staticClass:"a b",class:[y, 'y'],attrs:{value:"asdfasdfaf"}}, [], '')], '')}
  }
})

console.log(__weex_require_module__('dom'))
