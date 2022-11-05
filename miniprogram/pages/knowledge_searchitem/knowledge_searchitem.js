// pages/knowledge_searchitem/knowledge_searchitem.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        onlyid: "",
        title: "",
        dataList: "",
        disabledstar: false,
        starcolor: 'star_blue',
        star: false,
        login: false,
        logindg: false
    },

    //收藏词条
    star() {
        if (this.data.login) {
            //禁用按钮
            this.setData({
                disabledstar: true
            })
            if (this.data.star) {
                //从收藏数据库删除
                db.collection('user').where({
                    _openid: app.globalData.openid
                }).update({
                    data: {
                        'star.knowledge': _.pull(this.data.dataList.id)
                    },
                }).then(res => {
                    wx.vibrateShort()
                    //更新按钮状态
                    this.setData({
                        disabledstar: false,
                        star: false,
                        starcolor: "star_blue"
                    })
                })
            } else {
                //加入收藏数据库
                db.collection('user').where({
                    _openid: app.globalData.openid
                }).update({
                    data: {
                        'star.knowledge': _.addToSet(this.data.dataList.id)
                    },
                }).then(res => {
                    wx.vibrateShort()
                    //更新按钮状态
                    this.setData({
                        disabledstar: false,
                        star: true,
                        starcolor: "star_red"
                    })
                })
            }
        } else {
            this.setData({
                logindg: true
            })
        }
    },

    //放大图片
    gotobig(e) {
        wx.previewImage({
            current: e.currentTarget.dataset.item.img[e.currentTarget.dataset.info],
            urls: e.currentTarget.dataset.item.img // 需要预览的图片http链接列表
        })

    },

    //获取数据
    getdata() {
        db.collection('knowledge').where({
            id: this.data.onlyid
        }).get().then(res => {
            var data = res.data[0]
            this.setData({
                dataList: data,
                loading: false
            })
            //判断是否登录
            if (app.globalData.openid != '') {
                this.setData({
                    login: true
                })
                //读取用户收藏数据
                db.collection('user').where({
                    _openid: app.globalData.openid,
                    'star.knowledge': _.all([data.id])
                }).get().then(res => {
                    //设置收藏状态
                    if (res.data.length != 0) {
                        this.setData({
                            star: true,
                            starcolor: "star_red",
                        })
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            onlyid: options.id
        })
        this.getdata()
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