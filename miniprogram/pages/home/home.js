//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
// 设置采集声音参数
const options = {
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac'
}
// 连接云数据库
const db = wx.cloud.database();
// 数据库操作符
const _ = db.command;

Page({
  data: {
    //初始不显示跳过按钮
    show: true, //显示动画
    showview: true, //显示页面
    source: [],
    swiper: false,
    voice: "cloud://a-5gbhyzpd5bd8e0e5.612d-a-5gbhyzpd5bd8e0e5-1307133961/images/home/voice-1.gif",
    showsearch: false,
    recording: false,
    input: "",
    error: "没听清，请重新说一遍哦",
    showmessage: false,
    socstyle: "soc",
    recstyle: "rec",
    empty: false,
    result: [],
    loading: false,
    voiceclass: 'voiceright',
    tipsimg: '',
    showtips: false,
    hotloading: true,
    hotlist: []
  },

  //轮播点击事件回调
  touch({
    detail: data
  }) {
    wx.navigateTo({
      url: '/pages/knowledge_searchitem/knowledge_searchitem?id=' + data.id,
    })
  },

  //按下soc排行榜
  soctouch() {
    wx.vibrateShort({
      type: "medium"
    }) //按键震动效果（15ms）
    this.setData({
      socstyle: "soc_touch"
    })
  },

  //转跳到soc排行榜
  gotosocrank: function () {
    this.setData({
      socstyle: "soc"
    })
    wx.navigateTo({
      url: '/pages/socrank/socrank',
    })
  },

  //按下手机推荐
  rectouch() {
    wx.vibrateShort({
      type: "medium"
    }) //按键震动效果（15ms）
    this.setData({
      recstyle: "rec_touch"
    })
  },

  //转跳到手机推荐
  gotorec() {
    this.setData({
      recstyle: "rec"
    })
    wx.navigateTo({
      url: '/pages/recommend/recommend',
    })
  },

  //按下语音键
  streamRecord: function () {
    if (this.data.showsearch == false) {
      this.setData({
        showsearch: true
      })
      setTimeout(() => {
        this.tips()
      }, 2000)
      return
    } else {
      wx.vibrateShort({
        type: "medium"
      }) //按键震动效果（15ms）
      manager.start(options)
      this.setData({
        showtips: false,
        recording: true //录音状态为真
      })
    }
  },

  //松开语音键
  streamRecordEnd: function () {
    if (this.data.showsearch) {
      manager.stop()
      this.setData({
        recording: false
      })
    }
  },

  //关闭手机搜索弹窗
  closesearch() {
    this.setData({
      showsearch: false
    })
  },

  //识别语音 -- 初始化
  initRecord: function () {
    const that = this;
    // 有新的识别内容返回，则会调用此事件
    manager.onRecognize = function (res) {
      console.log(res)
    }
    // 正常开始录音识别时会调用此事件
    manager.onStart = function (res) {
      console.log("成功开始录音识别", res)
    }
    // 识别错误事件
    manager.onError = function (res) {
      console.error("error msg:", res.retcode, res.msg)
    }
    //识别结束事件
    manager.onStop = function (res) {
      console.log('..............结束录音')
      console.log('录音总时长 -->' + res.duration + 'ms');
      console.log('语音内容 --> ' + res.result);
      if (res.result == '') {
        that.setData({
          showmessage: true
        })
        return;
      }
      that.setData({
        input: (res.result).replace('。', '') //去掉自动添加的句号
      })
      that.search()
    }
  },

  //转跳到search页面
  gotosearch() {
    wx.navigateTo({
      url: '/pages/search/search?type=soc',
    })
  },

  //打字搜索手机
  searchphone(e) {
    this.setData({
      input: e.detail.value
    })
    this.search()
  },

  //搜索
  search() {
    this.setData({
      loading: true,
      empty: false,
      result: []
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'SpeechRecognition',
      // 传递给云函数的event参数
      data: {
        speech: this.data.input
      }
    }).then(res => {
      this.setData({
        loading: false,
        result: res.result.data
      })
      if (res.result.data == null || res.result.data.length == 0) {
        this.setData({
          empty: true
        })
      }
    }).catch(err => {
      this.setData({
        showmessage: true,
        error: '查询失败，请重试',
        loading: false
      })
    })
  },

  //转跳到手机页面
  gotophone(item) {
    wx.navigateTo({
      url: '/pages/phone/phone?id=' + item.currentTarget.dataset.item.id,
    })
  },

  //打开tips
  tips() {
    var n = Math.random() * 3
    //随机取一个tip
    if (n <= 1) {
      this.setData({
        tipsimg: '/images/tips1.jpg'
      })
    } else if (n <= 2) {
      this.setData({
        tipsimg: '/images/tips2.jpg'
      })
    } else {
      this.setData({
        tipsimg: '/images/tips3.jpg'
      })
    }
    this.setData({
      showtips: true
    })
    //显示5秒后关闭
    setTimeout(() => {
      this.setData({
        showtips: false
      })
    }, 5000);
  },

  //关闭tips
  closetips() {
    this.setData({
      showtips: false
    })
  },

  //加载手机热榜
  loadhot() {
    db.collection('hotphone').where({
      id: 'home'
    }).get().then(res => {
      db.collection('phone').where({
        id: _.in(res.data[0].phones)
      }).orderBy('rate', 'desc').get().then(res => {
        this.setData({
          hotlist: res.data,
          hotloading: false
        })
      })
    })
  },

  //加载swiper
  loadswiper() {
    db.collection('swiper').get().then(res => {
      this.setData({
        source: res.data,
        swiper: true
      })
      this.show()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化语音
    this.initRecord();
    //加载手机热榜
    this.loadhot()
    //加载swiper
    this.loadswiper()
  },

  //加载结束动画
  show() {
    setTimeout(() => {
      this.setData({
        show: false
      })
      //导航栏颜色渐变
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#3863BC',
        animation: {
          duration: 800,
          timingFunc: 'easeOut'
        }
      })
    }, 800)
    setTimeout(() => {
      this.setData({
        showview: false
      })
    }, 1600);
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //tabbar换页
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        index: 0
      })
    }
    //设置气泡自动弹出
    setTimeout(() => {
      if (this.data.showsearch == false) {
        this.tips()
      }
    }, 10000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})