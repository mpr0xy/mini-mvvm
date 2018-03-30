const util = require('./util')

/**
 * 脏检查
 * @param {*} data 对象
 * @param {*} key 对象里的key
 * @param {*} value 对象里的value
 * @param {*} ctx 上下文
 */
const OldObserver = function (data, key, value, ctx) {
  let _value = value
  const loop = () => {
    setTimeout(() => {
      if (data[key] !== _value) {
        _value = data[key]
        ctx._update()
      }
      loop()
    }, 500)
  }
  loop()
  return this
}

/**
 * 设置存取器
 * @param {*} data 对象
 * @param {*} key 对象里的key
 * @param {*} value 对象里的value
 * @param {*} ctx 上下文
 */
const Observer = function (data, key, value, ctx) {
  // IE 8
  if (!document.addEventListener) {
    return new OldObserver(data, key, value, ctx)
  }

  this.value = value
  this.watchers = []
  this.watcherObject = {}
  this.childrens = []
  /**
   * 添加观察者函数
   * @param {*} watcher 函数
   */
  this.addWatcher = (watcher) => {
    let hasOne = false
    this.watchers.forEach((item) => {
      if (item === watcher) {
        hasOne = true
      }
    })
    if (!hasOne) {
      this.watchers.push(watcher)
    }
  }
  /**
   * 运行当前变量下挂载的观察者函数
   */
  this.runWatcher = () => {
    // 把当前的
    this.watchers.forEach((item) => {
      item()
    })
    this.childrens.forEach((child) => {
      child.runWatcher()
    })
  }

  /**
   * 如果处理的值是对象，得循环处理
   */
  this.observerObject = () => {
    if (util.isObject(value)) {
      for (var name in value) {
        this.childrens.push(new Observer(value, name, value[name], ctx))
      }
    }
  }
  const vm = this
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: false,
    get: () => {
      // TODO 这里可以做到细粒度更新，那些地方使用了这个变量，这些地方的变更加入监听器
      console.log('get ' + vm.value)
      if (ctx._currentWatcher) {
        this.addWatcher(ctx._currentWatcher)
      }
      return vm.value
    },
    set: (newVal) => {
      if (newVal === vm.value) {
        return
      }
      vm.value = newVal
      // TODO 这个地方需要处理newVal为对象时，重新为newVal里面的值绑定get set并继承上一个value对象里带的watcher函数
      this.runWatcher()
    }
  })
  this.observerObject()
  return this
}

module.exports = Observer
