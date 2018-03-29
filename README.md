# mvvm


# 设计

## 设计目标

实现数据绑定、事件绑定、指令绑定


## 数据绑定

数据绑定需要进行模版编译，暂时只支持在textContent进行数据绑定

IE8 textContent 兼容性
https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent

## 事件绑定和指令绑定

需要读取每个标签元素的属性，进行绑定

## Observer

实现对象属性的变更通知，利用Object.defineProperty的读写器属性
