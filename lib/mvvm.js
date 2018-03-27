import util from './util';

var Compile = function Compile(ctx, dom) {
  // 识别DOM里的 {{  }}, 渲染为字段
  var childNodes = dom.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeType === 3) {
      var textContent = childNodes[i].textContent;
      var c = textContent.match(/{{$1}}/g);
      console.log(c);
    }
  }
};

var MVVM = function MVVM(options) {
  this._data = options.data ? util.deepCopy(options.data) : null;
  this._methods = options.methods ? util.deepCopy(options.methods) : null;

  var rootDom = MVVM.elementSelect(options.el);
  util.assign(this, this._data);
  util.assign(this, this._methods);
  Compile(this, rootDom);
};

MVVM.elementSelect = function (str) {
  if (!str) {
    return null;
  }
  if (str[0] === '#') {
    return document.getElementById(str.slice(1));
  }
  // TODO 支持其他选择器
};

export default MVVM;