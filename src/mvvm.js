const util = require('./util')

const Compile = function (ctx, dom) {
  // 识别DOM里的 {{  }}, 渲染为字段
  const childNodes = dom.childNodes
  for (var i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeType === 3) {
      const textContent = childNodes[i].textContent
      // 返回文本渲染
      const expressionObject = util.matchExpression(textContent)
      if (expressionObject) {
        // 一个节点可能对应多个渲染，多个渲染可能是重复的
        ctx._textUpdateList = ctx._textUpdateList.concat([
          {
            dom: childNodes[i],
            oldContent: textContent,
            expressionObject: expressionObject
          }
        ])
      }
    } else if (childNodes[i].nodeType === 1) {
      Compile(ctx, childNodes[i])
    }
  }
}

const MVVM = function (options) {
  this._data = options.data ? util.deepCopy(options.data) : null
  this._methods = options.methods ? util.deepCopy(options.methods) : null

  const rootDom = MVVM.elementSelect(options.el)
  util.assign(this, this._data)
  util.assign(this, this._methods)
  this._textUpdateList = []
  Compile(this, rootDom)

  // TEST 测试更新
  const that = this
  console.log(this._textUpdateList)
  this._textUpdateList.forEach((item) => {
    /* eslint-disable */
    let oldContent = item.oldContent
    // 循环更新Text里的表达式
    for (var key in item.expressionObject) {
      var newText = (new Function(`with(this){ return ${item.expressionObject[key]}}`)).bind(that)()
      oldContent = oldContent.replace(key, newText)
    }
    item.dom.textContent = oldContent
  })
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
