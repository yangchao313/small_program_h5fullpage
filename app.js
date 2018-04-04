App({
  util: require('we7/resource/js/util.js'),
  globalData: {
    userInfo: null,
    code: '',
  },

  onLaunch: function () {
    var that = this
    wx.login({
      success: function (res) {
        that.util.request({
          url: 'entry/wxapp/TabBar',
          data: {
            m: 'yyf_company'
          },
          cachetime: 0,
          success: function (res) {
              wx.setStorageSync('barlist', res.data.data)
          }
        });
      }
    });
  },

  tabBar: {
    "color": "#a9b7b7",
    "selectedColor": "#2d7dee",
    "borderStyle": "#eeeeee",
    "backgroundColor": "#ff9900",
    "list": [
      {
        "pagePath": "/we7/pages/index/index",
        "iconPath": "/we7/resource/icon/home.png",
        "selectedIconPath": "/we7/resource/icon/homeselect.png",
        "text": "首页"
      },
      {
        "pagePath": "/we7/pages/user/index/index",
        "iconPath": "/we7/resource/icon/user.png",
        "selectedIconPath": "/we7/resource/icon/userselect.png",
        "text": "联系"
      }
    ]
  },
	siteInfo : {"name":"\u6613\u798f\u6e90\u7801\u7f51","uniacid":"32","acid":"32","multiid":"0","version":"1.0.1","siteroot":"https://weixin.eqidian.com.cn/app/index.php","design_method":"3"}
});