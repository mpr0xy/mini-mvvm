const MVVM = require('./mvvm.js')

const app = new MVVM({
  el: '#app',
  data: {
    test: 'test',
    duration: 0,
    isOn: false // 启动或是暂停
  },
  methods: {
    formatDuration (duration) {
      var date = new Date(null)
      date.setSeconds(duration)
      return date.toISOString().substr(11, 8)
    },
    resume: function () {
      console.log('resume run')
      this.duration = 0
      this.clearTimer()
      this.start()
    },
    start: function () {
      console.log('start run')
      this.isOn = true
      var that = this
      this.timerId = setInterval(function () {
        that.duration += 1
      }, 1000)
    },
    pause: function () {
      console.log('pause run')
      this.isOn = false
      this.clearTimer()
    },
    clearTimer () {
      console.log('clearTimer run')
      this.timerId && clearInterval(this.timerId)
    }
  }
})

console.log(app)
