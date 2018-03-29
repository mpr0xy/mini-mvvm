const util = require('./util')

const Observer = function (data, key, value) {
  this.value = value
  const vm = this
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: false,
    get: () => {
      // TODO 这里可以做到细粒度更新，那些地方使用了这个变量，这些地方的变更加入监听器
      return vm.value
    },
    set: (newVal) => {
      if (newVal === vm.value) {
        return
      }
      vm.value = newVal
      data._update()
    }
  })
  const newData = data[key]
  if (util.isObject(newData)) {
    newData._Observers = []
    for (var name in newData) {
      newData._Observers.push(new Observer(newData, name, newData[name]))
    }
  }
  return this
}

module.exports = Observer
