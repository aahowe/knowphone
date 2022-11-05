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
        login: false,
        logindg: false,
        disabledstar: false,
        disabledvs: false,
        star: false,
        compare: false,
        vscolor: "vs_blue",
        starcolor: "star_blue",
        chartData: {},
        loading: true,
        id: "",
        img: "",
        name: "",
        brand: "",
        soc: "",
        date: "",
        rate: null,
        rowrate: null,
        ram: "",
        rom: "",
        port: "",
        position: "",
        wlan: "",
        bluetooth: "",
        network: "",
        sim: "",
        os: "",
        vib: "",
        camera: "",
        flash: "",
        fontc: "",
        backc: "",
        charge: "",
        battery: "",
        size_weigth: "",
        material: "",
        screen: "",
        refresh: "",
        resolution: "",
        size: "",
        jd: "",
        price: "",
        low: "",
        water: "",
        ratecount: null,
        disablerate: false,
        toast: false,
        toasttype: '',
        toastcontent: ''
    },

    //收藏按钮
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
                        'star.phone': _.pull(this.data.id)
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
                        'star.phone': _.addToSet(this.data.id)
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

    //加入对比按钮
    compare() {
        //判断是否登录
        if (this.data.login) {
            //禁用按钮
            this.setData({
                disabledvs: true
            })
            if (this.data.compare) {
                //从对比数据库删除
                db.collection('user').where({
                    _openid: app.globalData.openid
                }).update({
                    data: {
                        'compare.phone': _.pull(this.data.id)
                    },
                }).then(res => {
                    wx.vibrateShort()
                    //更新按钮状态
                    this.setData({
                        disabledvs: false,
                        compare: false,
                        vscolor: "vs_blue"
                    })
                })
            } else {
                //加入收藏数据库
                db.collection('user').where({
                    _openid: app.globalData.openid
                }).update({
                    data: {
                        'compare.phone': _.addToSet(this.data.id)
                    },
                }).then(res => {
                    wx.vibrateShort()
                    //更新按钮状态
                    this.setData({
                        disabledvs: false,
                        compare: true,
                        vscolor: "vs_yellow"
                    })
                })
            }
        } else {
            this.setData({
                logindg: true
            })
        }
    },

    //转跳京东小程序
    gojd() {
        wx.navigateToMiniProgram({
            appId: 'wx1edf489cb248852c',
            path: '/pages/proxy/union/union?spreadUrl=' + this.data.jd,
        })
    },

    //评分
    changerate(e) {
        //评分动画
        this.setData({
            toast: true,
            toasttype: 'loading',
            toastcontent: '新评分计算中'
        })
        //调用评分云函数
        wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'updateRate',
            // 传递给云函数的event参数
            data: {
                score: e.detail.score,
                ratecount: this.data.ratecount,
                id: this.data.id,
                rate: this.data.rowrate
            }
        }).then(res => {
            this.setData({
                rate: e.detail.score.toFixed(1),
                disablerate: true,
                toast: true,
                toasttype: 'success',
                toastcontent: '感谢您的评分'
            })
        }).catch(err => {
            this.setData({
                toast: true,
                toasttype: 'error',
                toastcontent: '评分失败'
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //加载phone数据
        db.collection('phone').where({
            id: options.id
        }).get().then(res => {
            var data = res.data[0]
            this.setData({
                id: data.id,
                img: data.img,
                name: data.name,
                brand: data.brand,
                soc: data.soc,
                date: data.date,
                rate: data.rate.toFixed(1),
                rowrate: data.rate,
                ram: data.ram,
                rom: data.rom,
                port: data.port,
                position: data.position,
                wlan: data.wlan,
                bluetooth: data.bluetooth,
                network: data.network,
                sim: data.sim,
                os: data.os,
                vib: data.vib,
                camera: data.camera,
                flash: data.flash,
                fontc: data.fontc,
                backc: data.backc,
                charge: data.charge,
                battery: data.battery,
                size_weigth: data.size_weigth,
                material: data.material,
                screen: data.screen,
                refresh: data.refresh,
                resolution: data.resolution,
                size: data.size,
                jd: data.jd,
                price: data.price,
                low: data.low,
                water: data.water,
                ratecount: data.ratecount,
                loading: false,
                chartData: {
                    categories: ["性能", "材质", "续航", "摄影", "生态", "屏幕"],
                    series: [{
                        name: data.name,
                        data: data.radar
                    }]
                }
            })
            //设置导航栏标题
            wx.setNavigationBarTitle({
                title: data.name
            })
            //判断是否登录
            if (app.globalData.openid != '') {
                this.setData({
                    login: true
                })
                //读取用户收藏数据
                db.collection('user').where({
                    _openid: app.globalData.openid,
                    'star.phone': _.all([data.id])
                }).get().then(res => {
                    //设置收藏状态
                    if (res.data.length != 0) {
                        this.setData({
                            star: true,
                            starcolor: "star_red",
                        })
                    }
                })
                //读取用户对比数据
                db.collection('user').where({
                    _openid: app.globalData.openid,
                    'compare.phone': _.all([data.id])
                }).get().then(res => {
                    //设置对比状态
                    if (res.data.length != 0) {
                        this.setData({
                            compare: true,
                            vscolor: "vs_yellow",
                        })
                    }
                })
            }
        })
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