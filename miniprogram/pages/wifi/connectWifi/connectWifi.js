// pages/connectWifi/connectWifi.js

Page({
  data: {
    msg: '',
    ssid: '', //Wi-Fi 的SSID，即账号//bssid: '', //Wi-Fi 的ISSID
    password: '', //Wi-Fi 的密码
    viewAccount: '',
    viewPassword: ''
  },

  onLoad: function (options) {
    if (options.ssid && options.pw) { 
      this.setData({
        ssid: decodeURIComponent(options.ssid),
        password: decodeURIComponent(options.pw),
        msg: "正在连接..."
      })
      this.connectWifi();
      return;
    }
    this.readWifiInfo();    
  },
  readWifiInfo: function () {
    var me = this;
    wx.getConnectedWifi({
      success: function (res) {
        me.msg("已经连接 Wi-Fi：" + res.wifi.SSID);
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  connectWifi: function () {
    var me = this;
    //检测手机型号
    wx.getSystemInfo({
      success: function (res) {
        var system = '';
        if (res.platform == 'android') system = parseInt(res.system.substr(8));
        if (res.platform == 'ios') system = parseFloat(res.system.substr(4));
        if (res.platform == 'android' && system < 6) {
          // me.msg("手机版本不支持");
          me.failMsg("手机版本不支持");
          return
        }
        if (res.platform == 'ios' && system < 11.2) {
          me.failMsg("手机版本不支持");
          return
        }
        //2.初始化 Wi-Fi 模块
        me.startWifi();
      }
    })
  },
  //初始化 Wi-Fi 模块
  startWifi: function () {
    var me = this
    wx.startWifi({
      success: function () {
        //请求成功连接Wifi
        me.connected();
      },
      fail: function (res) {
        me.failMsg("接口调用失败");
      }
    })
  },
  connected: function () {
    var me = this
    wx.connectWifi({
      SSID: me.data.ssid,
      BSSID: me.data.bssid,
      password: me.data.password,
      success: function (res) {
        wx.getConnectedWifi({
          success: function (res) {
            me.msg("已经连接 Wi-Fi：" + res.wifi.SSID);
          },
          fail: function (res) {
            me.failMsg("wifi连接失败");
          }
        });
      },
      fail: function (res) {
        if (res.errCode === 12007) {
          me.msg("用户拒绝授权链接 Wi-Fi");
          return;
        }
        if (res.errCode === 12005) {
          me.msg("Wi-Fi 开关未打开,请打开");
          return;
        }
        me.failMsg("wifi连接失败");
      }
    })
  },
  msg: function (msg) {
    var me = this;
    me.setData({
      msg: msg
    })
  },
  failMsg: function (msg) {
    var me = this;
    me.msg(msg);
    me.viewWifi();
  },
  viewWifi: function () {
    var me = this;
    me.setData({
      viewAccount: me.data.ssid,
      viewPassword: me.data.password
    })
  }
})