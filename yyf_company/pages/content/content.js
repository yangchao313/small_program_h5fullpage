var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article:{},
    copyright: '',
    id: 0,
    blist: {},
    tcolor: '',
    timer: 0,
    hide_time: '0',
    hide_title:'0'
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      copyright: app.globalData.copyright
    })
    var id=options.id;
    var that = this;
    var uniacid = app.siteInfo.uniacid;
    this.setData({
      id: id
    });
    app.util.request({
      url: 'entry/wxapp/content',
      data: {
        m: 'yyf_company',
        id: id,
        uniacid: uniacid
      },
      cachetime: 0,
      success: function (res) {
        if (!res.data.errno) {
          that.setTabBar(id)
          WxParse.wxParse('article1', 'html', res.data.data.content, that, 5);
          that.setData({
            article: res.data.data,
            hide_time: res.data.data.hide_time,
            hide_title: res.data.data.hide_title
          });
          wx.setNavigationBarTitle({
            title: res.data.data.title,
          })

        }
      },
      fail: function (res) {
        failGo(res.message);
      }
    });
    
  },

  onShareAppMessage: function (res) {
    return {
      title: this.data.article.title,
      path: '/yyf_company/pages/content/content?id=' + this.data.id
    }
  },

  setTabBar: function (id) {
    var blist = wx.getStorageSync('barlist');
    var that = this;
    var timer = this.data.timer + 1;
    this.setData({
      timer: timer
    })
    if (!blist && timer < 15) {
      setTimeout(function () {
        that.setTabBar()
      }, 200)
    }
    if (!blist) { return false; }
    this.setData({
      blist: blist,
      tcolor: blist.tcolor
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: blist.tcolor,
    })
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    var blist = this.data.blist;
    var options = currentPage.options

    if (options.id == id) {
      blist['isCurrentPage'] = true;
    }
    var barArr = new Array(blist.m1_path, blist.m2_path, blist.m3_path, blist.m4_path);
    var currentNum = 0;
    for (var x in barArr) {
      if (barArr[x] == 'a' + id) {
        currentNum = parseInt(x) + 1;
      }
    }
    blist['currentNum'] = currentNum;
    this.setData({
      blist: blist
    })
  },
  tel: function () {
    var phone = this.data.blist.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  driver: function () {
    wx.openLocation({
      latitude: Number(this.data.blist.jing),
      longitude: Number(this.data.blist.wei),
      address: this.data.blist.address
    })
  }


 

  
})