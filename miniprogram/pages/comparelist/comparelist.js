// 连接云数据库
const db = wx.cloud.database();
// 数据库操作符
const _ = db.command;
//聚合操作符
const $ = db.command.aggregate
//获取app.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        requesting: true,
        empty: false,
        list: [],
        result: [],
        touchedvs: false,
        touchedd: false,
        showmessage: false,
        message: "",
        messagetype: "",
        end: false
    },

    //点击对象与点击勾选同步
    check(e) {
        var target = e.currentTarget.dataset.id
        var result = this.data.result
        var index = result.indexOf(target)
        if (index == -1) {
            this.setData({
                result: result.concat([target])
            })
        } else {
            result.splice(index, 1)
            this.setData({
                result: result
            })
        }
    },

    //按下vs按钮
    touchvs() {
        //放大动画
        this.setData({
            touchedvs: true
        })
    },

    //松开vs按钮
    release() {
        //缩小动画
        this.setData({
            touchedvs: false
        })
        if (this.data.result.length == 2) {
            //若选中了两个手机，则转跳到对比页面
            wx.navigateTo({
                url: '/pages/phonecompare/phonecompare?id1=' + this.data.result[0] + '&id2=' + this.data.result[1]
            })
        } else {
            //显示提示消息
            this.setData({
                showmessage: true,
                message: "请选择两部手机进行对比",
                messagetype: "warning"
            })
        }
    },

    //按下delete按钮
    touchd() {
        //放大动画
        this.setData({
            touchedd: true
        })
    },

    //删除
    delete() {
        //缩小动画
        this.setData({
            touchedd: false
        })
        if (this.data.result.length == 0) {
            //如果未选中，则提示
            this.setData({
                showmessage: true,
                message: "请选择您要删除的手机",
                messagetype: "warning"
            })
        } else {
            //删除选中数据
            db.collection('user').where({
                _openid: app.globalData.openid
            }).update({
                data: {
                    'compare.phone': _.pull(_.in(this.data.result))
                },
            }).then(res => {
                this.setData({
                    showmessage: true,
                    message: "删除成功",
                    messagetype: "success",
                    result: []
                })
                this.getres()
            })
        }
    },

    //checkbox-group选中内容改变
    onChange(event) {
        this.setData({
            result: event.detail,
        });
    },

    //列表刷新事件
    refresh() {
        //刷新动画开始
        this.setData({
            requesting: true
        })
        this.getres()
    },

    //获取数据
    getres() {
        //读取用户的对比列表数据
        db.collection('user').where({
            _openid: app.globalData.openid
        }).get().then(res => {
            //如果用户收藏列表为空
            if (res.data[0].compare.phone.length == 0) {
                this.setData({
                    list: [],
                    empty: true,
                    requesting: false
                })
            } else {
                //如果不为空，则换取手机列表
                db.collection('phone').where({
                    id: _.in(res.data[0].compare.phone)
                }).get().then(res => {
                    this.setData({
                        list: res.data,
                        requesting: false
                    })
                })
            }
        })
    },

    //加载更多
    more() {
        var array = this.data.list
        //读取用户的对比列表数据
        db.collection('user').where({
            _openid: app.globalData.openid
        }).get().then(res => {
            db.collection('phone').where({
                id: _.in(res.data[0].compare.phone)
            }).skip(array.length).get().then(res => {
                if (res.data.length == 0) {
                    this.setData({
                        end: true
                    })
                } else {
                    array = array.concat(res.data)
                    this.setData({
                        list: array
                    })
                }
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //设置导航栏标题
        wx.setNavigationBarTitle({
            title: "手机对比"
        })
        this.getres()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

})