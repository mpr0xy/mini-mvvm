const util = require('./util')
const Compile = require('./compile')
const Observer = require('./observer')

const MVVM = function (options) {
  this._data = options.data ? util.deepCopy(options.data) : null
  this._methods = options.methods ? util.deepCopy(options.methods) : null

  // 把_data里的变量处理成响应式的
  util.assign(this, this._data)
  this._Observers = []
  for (var key in this._data) {
    this._Observers.push(new Observer(this, key, this._data[key], this))
  }

  const rootDom = MVVM.elementSelect(options.el)
  util.assign(this, this._methods)
  // 定义内部调用函数数组
  this._textUpdateList = []
  this._renderFunctions = []

  // 全量更新函数
  this._update = () => {
    this._renderFunctions.forEach((item) => {
      try {
        item()
      } catch (e) {
        console.error(e)
      }
    })
  }
  Compile(this, rootDom)
  const textRender = () => {
    this._textUpdateList.forEach((item) => {
      /* eslint-disable */
      // 一个观察者函数，这个观察者函数会传递到Observer对象里，获得变量第一次出现的地方
      const updateFunc = () => {
        let oldContent = item.oldContent
        // 循环更新Text里的表达式
        this.currentComplieDom = item.dom
        for (var key in item.expressionObject) {
          var newText = (new Function(`with(this){ return ${item.expressionObject[key]}}`)).bind(this)()
          oldContent = oldContent.replace(key, newText)
        }
        item.dom.textContent = oldContent
      } 
      this._currentWatcher = updateFunc
      updateFunc()
      // 清空监听器
      this._currentWatcher = null
    })
  }
  // 初始化的时候执行一次文本渲染
  textRender()
  this._renderFunctions.push(textRender)

  // TEST 测试更新
  console.log(this)
  return this
}

MVVM.elementSelect = function (str) {
  if (!str) {
    return null
  }
  if (str[0] === '#') {
    return document.getElementById(str.slice(1))
  }
  // TODO 支持其他选择器
}

module.exports = MVVM
