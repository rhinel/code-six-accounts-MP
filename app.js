//app.js
App({
  // data
  globalData: {
    userInfo: null
  },
  // 生命周期
  onLaunch(options) {
    console.log(options)
  },
  // 方法定义
  getUserInfo(cb) {
    // 获取用户信息
    let that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      // 调用登录接口
      wx.login({
        success() {
          wx.getUserInfo({
            success(res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            },
            fail(res) {
              that.globalData.userInfo = {
                nickName: 'Friend',
                avatarUrl: '/assets/photo.jpg'
              }
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  }
})