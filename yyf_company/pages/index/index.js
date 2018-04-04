var app = getApp()
Page({
  data:{
    slide: [],
    sysinfo: {},
    list: [],
    cats: [],
    copyright:'',
    blist:{},
    tcolor:'',
    horn:'',
    slide_close:'0',
    nav_close: '0',
    notice_close: '0',
    slide_height:'',
    adsense:{},
    nav_style:'0',
    title_style:'0',
    timer:0,
    show_video:false,
    hide_time:'0',
    scrollindex: 0,  //当前页面的索引值
    totalnum: 1,  //总共页面数
    starty: 0,  //开始的位置x
    endy: 0, //结束的位置y
    critical: 100, //触发翻页的临界值
    margintop: 0,  //滑动下拉距离
  },
  onLoad:function(options){
    var that = this
    var uniacid = app.siteInfo.uniacid;
    that.setTabBar()
    app.util.request({
      url: 'entry/wxapp/index',  
      data: {
        m: 'yyf_company',
        uniacid: uniacid
      },
      cachetime: 0,
      success: function (res) {
        if (!res.data.errno) {
          that.setData({
            slide: res.data.data.slide,
            totalnum: res.data.data.slide.length,
            sysinfo: res.data.data.sysinfo,
            list:res.data.data.list,
            cats: res.data.data.cats,
            horn:res.data.data.horn,
            notice_close: res.data.data.notice_close,
            slide_close: res.data.data.slide_close,
            nav_close: res.data.data.nav_close,
            slide_height: res.data.data.slide_height,
            nav_style: res.data.data.nav_style,
            title_style: res.data.data.title_style,
            hide_time: res.data.data.hide_time
          })
          wx.setNavigationBarTitle({
            title: res.data.data.sysinfo.title,
          })
          app.globalData.copyright = res.data.data.sysinfo.copyright;
          
        }
      },
      fail: function (res) {
        failGo(res.message);
      }
    });

    app.util.request({
      url: 'entry/wxapp/Adsense',
      data: {
        m: 'yyf_company',
        uniacid: uniacid
      },
      cachetime: 0,
      success: function (res) {
        if (!res.data.errno) {
          that.setData({
            adsense: res.data.data,
           
          })
        }
      }
    });
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.sysinfo.name,
      path: '/yyf_company/pages/index/index'
    }
  },

  setTabBar: function (){
    var blist = wx.getStorageSync('barlist');
    var that=this;
    var timer=this.data.timer+1;
    this.setData({
      timer:timer
    })
    if(!blist && timer<15){
      setTimeout(function () {
        that.setTabBar()
      }, 200)
    }
    if (!blist) { return false;}
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
    var url = currentPage.route
    var blist = this.data.blist;
    var pageArr = url.split('/');
    if (pageArr[pageArr.length - 1] == 'index') {
      blist['isCurrentPage'] = true;
    }
    var barArr = new Array(blist.m1_path, blist.m2_path, blist.m3_path, blist.m4_path);
    var currentNum = 0;
    for (var x in barArr) {
      if (barArr[x] == 'index') {
        currentNum = parseInt(x) + 1;
      }
    }
    blist['currentNum'] = currentNum;
    this.setData({
      blist: blist
    })  
    
    
  },
  //电话
  tel: function () {
    var phone = this.data.sysinfo.phone
    wx.makePhoneCall({
      phoneNumber: phone, 
    })
  },
  //预约
  message: function() {
    wx.navigateTo({
      url: '../message/message'
    })
  },
  //导航
  gomap: function () {
    wx.openLocation({
      latitude: Number(this.data.sysinfo.jing),
      longitude: Number(this.data.sysinfo.wei),
      address: this.data.sysinfo.address
    })
  },
  scrollTouchstart: function (e) {
    let py = e.touches[0].pageY;
    this.setData({
      starty: py
    })
  },
  scrollTouchmove: function (e) {
    let py = e.touches[0].pageY;
    let d = this.data;
    this.setData({
      endy: py,
    })
    if (py - d.starty < d.critical && py - d.starty > -d.critical) {
      this.setData({
        margintop: py - d.starty
      })
    }
  },
  scrollTouchend: function (e) {
    let d = this.data;
    if(d.endy == 0){
      this.setData({
        starty: 0
      })
    }
    if (d.endy - d.starty > d.critical && d.scrollindex > 0) {
      this.setData({
        scrollindex: d.scrollindex - 1
      })
    } else if (d.endy - d.starty < -d.critical && d.starty != 0 && d.scrollindex < this.data.totalnum - 1) {
      this.setData({
        scrollindex: d.scrollindex + 1
      })
    }
    this.setData({
      starty: 0,
      endy: 0,
      margintop: 0
    })
  }


  
})