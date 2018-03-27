import _typeof from 'babel-runtime/helpers/typeof';
/**
 * 深度考评
 * @param {*} source
 */
var deepCopy = function deepCopy(source) {
  var result = {};
  for (var key in source) {
    result[key] = _typeof(source[key]) === 'object' ? deepCopy(source[key]) : source[key];
  }
  return result;
};

/**
 * 组合对象
 * @param {*} target
 * @param {*} source
 */
var assign = function assign(target, source) {
  var tmp = deepCopy(source);
  for (var key in target) {
    target[key] = tmp[key];
  }
  return target;
};

var matchExpression = function matchExpression(textContent) {
  var matchList = textContent.match(/\{\{([^{}]*)\}\}/g);
  console.log(matchList);
  var expression = {};
  matchList.forEach(function (item) {
    var exp = item.match(/\{\{(.*)\}\}/);
    console.log(exp);
    expression[item] = exp[1];
  });
  return expression;
};

var test = '{{ a }} dfadf {{ func(a) }}';
var expressionObject = matchExpression(test);
console.log(expressionObject);
var object = {
  a: 1,
  func: function func(t) {
    return t + 1;
  }
  /* eslint-disable */
};console.log(object);
var a = 'with(object) {a}';
var b = 'with(object) {func(a)}';
console.log(eval(a));
console.log(eval(b));

export default {
  deepCopy: deepCopy,
  assign: assign,
  matchExpression: matchExpression
};