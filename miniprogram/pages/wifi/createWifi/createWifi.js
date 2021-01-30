// pages/createWifi/createWifi.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: '',
    account: '',
    password: '',
    msg: ''
  },

  createWifi: function () {
    var me = this;
    if (me.data.account === '' || me.data.password === '') {
      wx.showToast({
        title: '输入账户和密码',
      })
      return;
    }
    wx.showLoading({
      title: '正在生成',
      mask: true
    })
    me.setData({
      imageSrc: ''
    });

    var param = "ssid=" + encodeURIComponent(me.data.account) + "&pw=" + encodeURIComponent(me.data.password);
    wx.cloud.callFunction({
      name: 'wifiCode',
      data: {
        //action:"unlimited",
        //scene:""
        pagePath: "pages/wifi/connectWifi/connectWifi",
        param: param
      },
      success: res => {

        wx.cloud.downloadFile({
          fileID: res.result,
          success: res => {
            me.setData({
              imageSrc: res.tempFilePath
            });
          },
          fail: res => {
            wx.showToast({
              title: '生成失败',
            })
          },
          complete: function () {
            wx.hideLoading();
          }
        })

        // me.setData({
        //   imageSrc: res.result
        // }); 
        // wx.hideLoading();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '生成失败',
        })
      }
    })
  },

  bindAccount: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  bindPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  downLoadImage(e) {
    if (!e.target.dataset.src) {
      return;
    };
    this.downLoad(e.target.dataset.src)
  },
  downLoad: function (url) {
    var me = this;
    wx.showModal({
      title: '提示',
      content: '是否存储照片',
      success(res) {
        if (res.confirm) {
          me.downloadFileImage(url);
        }
      }
    })
  },
  downLoadT: function (tempPath) {
    var me = this;
    wx.showModal({
      title: '提示',
      content: '是否存储照片',
      success(res) {
        if (res.confirm) {
          me.saveImg(tempPath);
        }
      }
    })
  },
  openC: function (success) {
    wx.showModal({
      title: '提示',
      content: '需要您授权保存相册',
      showCancel: false,
      success() {
        wx.openSetting({ //进入小程序授权设置页面
          success: function (settingdata) {
            console.log(settingdata)
            if (settingdata.authSetting['scope.writePhotosAlbum']) { //用户打开了保存图片授权开关
              if (success) {
                success();
              }
            } else {
              wx.showToast({
                title: '授权失败',
              })
            }
          }
        });
      }
    });
  },
  downloadFileImage(imgPath) {
    var me = this;
    wx.showLoading({
      title: '正在保存',
      mask: true
    });
    me.saveImg(imgPath);
    return
    wx.cloud.downloadFile({
      fileID: imgPath,
      success: res => {
        me.saveImg(res.tempFilePath);
      },
      fail: res => {
        wx.showToast({
          title: '保存失败',
        })
      }
    })
  },
  saveImg: function (tempPath) {
    var me = this;
    wx.saveImageToPhotosAlbum({
      filePath: tempPath,
      success: function (res) {
        wx.showToast({
          title: '保存成功',
        })
      },
      fail: function (res) {
        console.log(res);
        if ("saveImageToPhotosAlbum:fail auth deny" === res.errMsg ||
          "saveImageToPhotosAlbum:fail authorize no response" === res.errMsg) {
          wx.hideLoading();
          me.openC(function () {
            me.downLoadT(tempPath);
          });
          return;
        }
        wx.showToast({
          title: '保存失败',
        })
      }
    });

  }
})