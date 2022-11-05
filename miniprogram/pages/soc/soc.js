// 连接云数据库
const db = wx.cloud.database();
// 获取集合的引用
const socCollection = db.collection('soc');
// 数据库操作符
const _ = db.command;
//获取app
const app = getApp()

Page({
    data: {
        socname: '',
        zh_name: '',
        icon: '',
        cpu_spec: '',
        gpu_spec: '',
        process: '',
        gb5: '',
        gfx5: '',
        score: '',
        power_gpu: '',
        phone: [],
        rate: null,
        rowrate: null,
        id: "",
        loading: true,
        disabledstar: false,
        disabledvs: false,
        star: false,
        vscolor: "vs_blue",
        starcolor: "star_blue",
        logindg: false,
        ratecount: null,
        disablerate: false,
        toast: false,
        toasttype: '',
        toastcontent: ''
    },

    //转跳到手机页面
    gophone(e) {
        if (e.currentTarget.dataset.id == 'default') {
            return
        } else {
            wx.navigateTo({
                url: '/pages/phone/phone?id=' + e.currentTarget.dataset.id
            })
        }
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
                        'star.soc': _.pull(this.data.id)
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
                        'star.soc': _.addToSet(this.data.id)
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
            name: 'updateRate_soc',
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
        db.collection('soc').where({
            id: options.id
        }).get().then(res => {
            var data = res.data[0]
            this.setData({
                socname: data.name,
                zh_name: data.zh_name,
                icon: data.icon,
                cpu_spec: data.cpu_spec,
                gpu_spec: data.gpu_spec,
                process: data.process,
                gb5: data.gb5,
                gfx5: data.gfx5,
                score: data.score,
                power_gpu: data.power_gpu,
                phone: data.phone,
                rate: data.rate.toFixed(1),
                rowrate: data.rate,
                id: data.id,
                ratecount: data.ratecount,
                loading: false
            })
            //设置导航栏标题
            wx.setNavigationBarTitle({
                title: data.zh_name
            })
            //判断是否登录
            if (app.globalData.openid != '') {
                this.setData({
                    login: true
                })
                //读取用户收藏数据
                db.collection('user').where({
                    _openid: app.globalData.openid,
                    'star.soc': _.all([options.id])
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
                // db.collection('user').where({
                //     _openid: app.globalData.openid,
                //     'compare.phone': _.all([data.id])
                // }).get().then(res => {
                //     //设置对比状态
                //     if (res.data.length != 0) {
                //         this.setData({
                //             compare: true,
                //             vscolor: "vs_yellow",
                //         })
                //     }
                // })
            }
        })
    },

})