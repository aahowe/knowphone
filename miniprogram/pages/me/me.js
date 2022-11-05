// 连接云数据库
const db = wx.cloud.database();
// 数据库操作符
const _ = db.command;
//获取app.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        avatarurl: "",
        name: "用户昵称",
        hasUserInfo: false,
    },
    //获取openid
    getOpenid() {
        wx.cloud.callFunction({
            name: 'getOpenId'
        }).then(res => {
            //赋值给全局opendata
            app.globalData.openid = res.result.openid
            //缓存openid
            wx.setStorageSync('openid', res.result.openid)
            //注册用户
            this.rigister()
        })
    },
    //获取头像昵称
    getprofile() {
        if (this.data.hasUserInfo == false) {
            //判断是否可以调用getuserprofile
            wx.getUserProfile({
                desc: '用于显示用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    this.setData({
                        avatarurl: res.userInfo.avatarUrl,
                        name: res.userInfo.nickName,
                        hasUserInfo: true
                    })
                    //缓存userinfo
                    wx.setStorageSync('userInfo', res.userInfo)
                    //获取openid
                    this.getOpenid()
                }
            })
        }
    },
    //转跳到我的收藏
    gofavor() {
        if (this.data.hasUserInfo == true) {
            wx.navigateTo({
                url: '/pages/myStar/myStar',
            })
        } else {
            this.getprofile()
        }
    },
    //转跳到我的对比
    gocompare() {
        if (this.data.hasUserInfo == true) {
            wx.navigateTo({
                url: '/pages/comparelist/comparelist',
            })
        } else {
            this.getprofile()
        }
    },
    //注册用户信息到数据库
    rigister() {
        db.collection('user').where({
            _openid: app.globalData.openid
        }).get().then(res => {
            if (res.data.length == 0) {
                db.collection('user').add({
                    data: {
                        star: {
                            soc: [],
                            phone: [],
                            knowledge: []
                        },
                        compare: {
                            phone: []
                        }
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //提取缓存
        var userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                avatarurl: userInfo.avatarUrl,
                name: userInfo.nickName,
                hasUserInfo: true
            })
        } else {
            this.setData({
                avatarurl: "/images/default_avatar.jpeg"
            })
        }
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
                index: 3
            })
        }
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

    },
})