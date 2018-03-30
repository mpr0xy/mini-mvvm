// 兼容IE 8
if (Object.defineProperty &&
  Object.getOwnPropertyDescriptor &&
  Object.getOwnPropertyDescriptor(Element.prototype, 'textContent') &&
  !Object.getOwnPropertyDescriptor(Element.prototype, 'textContent').get) {
  (function () {
    var innerText = Object.getOwnPropertyDescriptor(Element.prototype, 'innerText')
    Object.defineProperty(Element.prototype, 'textContent',
      // Passing innerText or innerText.get directly does not work,
      // wrapper function is required.
      {
        get: function () {
          return innerText.get.call(this)
        },
        set: function (s) {
          return innerText.set.call(this, s)
        }
      }
    )
  })()
}

const isObject = (data) => {
  return typeof data === 'object' && Object.prototype.toString.call(data).toLowerCase() === '[object object]' && !data.length
}

/**
 * 深度考评
 * @param {*} source
 */
const deepCopy = function (source) {
  var result = {}
  for (var key in source) {
    result[key] = (typeof source[key] === 'object') ? deepCopy(source[key]) : source[key]
  }
  return result
}

/**
 * 组合对象
 * @param {*} target
 * @param {*} source
 */
const assign = function (target, source) {
  var tmp = deepCopy(source)
  for (var key in tmp) {
    target[key] = tmp[key]
  }
  return target
}

const matchExpression = function (textContent) {
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

/**
 * 是否是事件属性
 * @param {*} node
 */
const isEventAttr = function (node) {
  if (node.name.indexOf('@') === 0) {
    return true
  }
  return false
}

/**
 * 是否是指令属性
 * @param {*} node
 */
const isDirectiveAttr = function (node) {
  if (node.name.indexOf('v-') === 0) {
    return true
  }
  return false
}
// test match
// const test = '{{ a }} dfadf {{ func(a) }}'
// var expressionObject = matchExpression(test)
// console.log(expressionObject)
// const object = {
//   a: 1,
//   func: function () {
//     return a + 1
//   }
// }
// /* eslint-disable */
// console.log(object)
// var a = `with(object) {a}`
// var b = `with(object) {func(a)}`
// console.log(eval(a))
// console.log(eval(b))

module.exports = {
  deepCopy,
  assign,
  matchExpression,
  isEventAttr,
  isDirectiveAttr,
  isObject
}
