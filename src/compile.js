/**
 * 编译函数，用于编译模版里的表达式、标签属性、和指令
 * @param {*} ctx 实例对象，对应MVVM里的this
 * @param {*} dom 模版根对象，暂不支持根对象上的指令和属性
 */
const Compile = (ctx, dom) => {
  // 识别DOM里的 {{  }}, 渲染为字段
  const childNodes = dom.childNodes
  for (var i = 0; i < childNodes.length; i++) {
    // 如果是文本
    const node = childNodes[i]
    if (node.nodeType === 3) {
      const textContent = node.textContent
      // 返回文本渲染
      const expressionObject = Compile.matchExpression(textContent)
      if (expressionObject) {
        // 一个节点可能对应多个渲染，多个渲染可能是重复的
        ctx._textUpdateList = ctx._textUpdateList.concat([
          {
            dom: node,
            oldContent: textContent,
            expressionObject: expressionObject
          }
        ])
      }
    // 如果是标签元素
    } else if (node.nodeType === 1) {
      // 编译属性
      const attributes = node.attributes
      // 每种属性编采用不用的编译方式
      Array.prototype.forEach.call(attributes, (item) => {
        if (Compile.isEventAttr(item)) {
          Compile.compileEvent(ctx, node, item)
        } else if (Compile.isDirectiveAttr(item)) {
          Compile.compileDirective(ctx, node, item)
        }
        // TODO 这里可以支持更多的指令属性写法
      })
      Compile(ctx, childNodes[i])
    }
  }

  const textRender = () => {
    ctx._textUpdateList.forEach((item) => {
      /* eslint-disable */
      let oldContent = item.oldContent
      // 循环更新Text里的表达式
      for (var key in item.expressionObject) {
        var newText = (new Function(`with(this){ return ${item.expressionObject[key]}}`)).bind(ctx)()
        oldContent = oldContent.replace(key, newText)
      }
      item.dom.textContent = oldContent
    })
  }
  // 初始化的时候执行一次文本渲染
  textRender()
  ctx._renderFunctions.push(textRender)
}

/**
 * 是否是事件属性
 * @param {*} node 属性节点
 */
Compile.isEventAttr = (node) => {
  if (node.name.indexOf('@') === 0) {
    return true
  }
  return false
}

/**
 * 是否是指令属性
 * @param {*} node 属性节点
 */
Compile.isDirectiveAttr = function (node) {
  if (node.name.indexOf('v-') === 0) {
    return true
  }
  return false
}

/**
 * 编译事件
 * @param {*} ctx 实例对象
 * @param {*} dom 当前dom元素
 * @param {*} node 需要编译的属性节点
 */
Compile.compileEvent = (ctx, dom, node) => {
  const eventName = node.name.slice(1)
  dom.addEventListener(eventName, (event) => {
    // 如果这里对象中含有这个元素，直接当成函数执行
    if (ctx[node.nodeValue]) {
      try {
        ctx[node.nodeValue](event)
      } catch (e) {
        console.error(e)
      }
    } else {
      // 如果不是，当成表达式执行
      /* eslint-disable */
      try {
        (new Function(`with(this){ return ${node.nodeValue} }`)).bind(ctx)()
      } catch (e) {
        console.error(e)
      }
    }
  })
}

/**
 * 编译v-开头的属性
 * @param {*} ctx 实例对象
 * @param {*} dom 当前元素dom
 * @param {*} node 属性节点
 */
Compile.compileDirective = function (ctx, dom, node) {
  const directive = node.nodeName.slice(2)
  switch(directive) {
    case 'if':
      // 如果是if 判断if 属性里的值是true还是false
      /* eslint-disable */
      let currentValue = true
      let display = dom.style.display
      const render = () => {
        console.log(node.nodeValue)
        const ifValue = (new Function(`with(this){ return ${node.nodeValue }}`)).bind(ctx)()
        // TODO 这里如果if为false是删除dom元素的话，为true再添加dom元素的时候，可能会找不着位置，这里倾向于把节点替换为一个空的text节点
        if (ifValue && !currentValue) {
          // TODO 添加节点 这里先做显示隐藏 后续再考虑 真的删除和添加
          dom.style.display = display
        } else if (!ifValue && currentValue) {
          // TODO 删除节点
          dom.style.display = 'none'
        }
        currentValue = ifValue
      }
      render()
      ctx._renderFunctions.push(render)
      break
  }
}

/**
 * 匹配字符串里保护 {{ Expression }} 的子串，返回的一个对象。比如：
 * 金额: {{ price }} 元
 * {
 *    '{{ price }}': 'price'
 * }
 * @param {*} textContent 字符串
 */
Compile.matchExpression = (textContent) => {
  const matchList = textContent.match(/\{\{([^{}]*)\}\}/g)
  if (!matchList) {
    return null
  }
  const expression = {}
  matchList.forEach((item) => {
    const exp = item.match(/\{\{(.*)\}\}/)
    if (exp) {
      expression[item] = exp[1]
    }
  })
  return expression
}

module.exports = Compile
