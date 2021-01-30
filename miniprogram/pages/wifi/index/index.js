//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: '',
    result: ''
  },
  onLoad: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  onGetUserInfo: function (e) {
    console.log(e)
    if (this.data.userInfo || e.detail.userInfo) {
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      return
    }
    console.log(e)
  },
  getScancode: function () {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        //console.log(res);
        if (res.path) {
          var path = res.path;
          if (path[0] !== '/') {
            path = "/" + path;
          }
          wx.navigateTo({
            url: path,
          })
          return
        }

        _this.setData({
          result: result,
        })
      }
    })
  },

  createWifi: function () {
    wx.navigateTo({
      url: '/pages/wifi/createWifi/createWifi'
    })
  }
})