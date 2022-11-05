// 连接云数据库
const db = wx.cloud.database();
// 数据库操作符
const _ = db.command;
//用来获取全局变量
const app = getApp();
Page({
    data: {
        //内容有无的标志
        flag: -1,
        //切换栏数据
        scrollViewTitle: ['手机', 'SOC', '词条'],
        //记录当前选中切换栏
        currentIndex: 0,
        //soc列表
        ListSoc: [],
        //phone列表
        ListPhone: [],
        //knowledge列表
        listData: [],
        //用户收藏phone
        ListUserPhone: [],
        //用户收藏soc
        ListUserSoc: [],
        //用户收藏knowledge
        ListUserKnowledge: [],
        //用户唯一标识
        open_id: "",
        loading: true,
        showmessage: false,
        loadtype: 'loading'
    },

    //切换事件
    changeCurrentIndex: function (e) {
        this.setData({
            currentIndex: e.currentTarget.id,
        })
        this.Utils1()
    },

    //列表项点击事件
    cellClick(e) {
        //得到第几项
        let {
            index
        } = e.currentTarget.dataset;
        //跳转
        if (this.data.currentIndex == 0) {
            wx.navigateTo({
                url: '/pages/phone/phone?id=' + this.data.ListPhone[index].id
            })
        } else if (this.data.currentIndex == 1) {
            wx.navigateTo({
                url: '/pages/soc/soc?id=' + this.data.ListSoc[index].id,
            })
        } else if (this.data.currentIndex == 2) {
            wx.navigateTo({
                url: '/pages/knowledge_searchitem/knowledge_searchitem?id=' + this.data.listData[index].id,
            })
        }
    },

    //数组删除函数
    remove: function (array, val) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == val) {
                array.splice(i, 1);
            }
        }
        return -1;
    },

    //滑动删除事件
    delete(e) {
        let {
            index
        } = e.currentTarget.dataset;
        if (this.data.currentIndex == 0) {
            this.remove(this.data.ListUserPhone, this.data.ListPhone[index].id)
            db.collection('user').where({
                _openid: this.data.open_id
            }).update({
                data: {
                    'star.phone': this.data.ListUserPhone
                },
            }).then(res => {
                this.setData({
                    ListPhone: "",
                    showmessage: true
                })
                if (this.data.ListUserPhone.length == 0) {
                    this.setData({
                        flag: 1
                    })
                }
                this.readData();
            })

        } else if (this.data.currentIndex == 1) {
            this.remove(this.data.ListUserSoc, this.data.ListSoc[index].id)
            db.collection('user').where({
                _openid: this.data.open_id
            }).update({
                data: {
                    'star.soc': this.data.ListUserSoc
                },
            }).then(res => {
                this.setData({
                    ListSoc: "",
                    showmessage: true
                })
                if (this.data.ListUserSoc.length == 0) {
                    this.setData({
                        flag: 1
                    })
                }
                this.readData();
            })
        } else if (this.data.currentIndex == 2) {
            this.remove(this.data.ListUserKnowledge, this.data.listData[index].id)
            db.collection('user').where({
                _openid: this.data.open_id
            }).update({
                data: {
                    'star.knowledge': this.data.ListUserKnowledge
                },
            }).then(res => {
                this.setData({
                    listData: "",
                    showmessage: true
                })
                if (this.data.ListUserKnowledge.length == 0) {
                    this.setData({
                        flag: 1
                    })
                }
                this.readData();
            })
        }
    },

    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {
        // 调用刷新时将执行的方法
        this.onRefresh();
    },

    //触底加载更多
    onReachBottom: function () {
        this.getmore()
    },

    //加载更多
    getmore() {
        if (this.data.currentIndex == 0) {
            //如果满20个数据
            if (this.data.ListPhone.length % 20 == 0) {
                this.setData({
                    loadtype: 'loading'
                })
                db.collection("phone").where({
                    id: _.in(this.data.ListUserPhone)
                }).skip(this.data.ListPhone.length).get().then(res => {
                    console.log(res.data.length)
                    if (res.data.length == 0) {
                        this.setData({
                            loadtype: 'end'
                        })
                    }
                    this.setData({
                        ListPhone: this.data.ListPhone.concat(res.data),
                    })
                })
            }
        } else if (this.data.currentIndex == 1) {
            //如果满20个数据
            if (this.data.ListSoc.length % 20 == 0) {
                this.setData({
                    loadtype: 'loading'
                })
                db.collection("soc").where({
                    id: _.in(this.data.ListUserSoc)
                }).skip(this.data.ListSoc.length).get().then(res => {
                    console.log(res.data.length)
                    if (res.data.length == 0) {
                        this.setData({
                            loadtype: 'end'
                        })
                    }
                    this.setData({
                        ListSoc: this.data.ListSoc.concat(res.data),
                    })
                })
            }
        } else if (this.data.currentIndex == 2) {
            //如果满20个数据
            if (this.data.listData.length % 20 == 0) {
                this.setData({
                    loadtype: 'loading'
                })
                db.collection("knowledge").where({
                    id: _.in(this.data.ListUserKnowledge)
                }).skip(this.data.listData.length).get().then(res => {
                    console.log(res.data.length)
                    if (res.data.length == 0) {
                        this.setData({
                            loadtype: 'end'
                        })
                    }
                    this.setData({
                        listData: this.data.listData.concat(res.data),
                    })
                })
            }
        }
    },

    //对数据库进行数据初始化
    readData() {
        this.setData({
            loadtype: 'loading',
            open_id: app.globalData.openid
        })
        db.collection('user').where({
            _openid: this.data.open_id
        }).get().then(res => {
            this.setData({
                ListUserPhone: res.data[0].star.phone,
                ListUserSoc: res.data[0].star.soc,
                ListUserKnowledge: res.data[0].star.knowledge,
                loadtype: 'end'
            })
            db.collection('phone').where({
                id: _.in(this.data.ListUserPhone)
            }).get().then(res => {
                var data = res.data
                this.setData({
                    ListPhone: data
                })
                this.Utils1()
                db.collection('soc').where({
                    id: _.in(this.data.ListUserSoc)
                }).get().then(res => {
                    var data = res.data
                    this.setData({
                        ListSoc: data
                    })
                })
                db.collection('knowledge').where({
                    id: _.in(this.data.ListUserKnowledge)
                }).get().then(res => {
                    var data = res.data
                    this.setData({
                        listData: data
                    })
                })
            })
        })
    },

    //进入
    onShow: function () {
        this.readData();
    },

    //用于判断内容有无设置内容暂无图像
    Utils1() {
        if (((this.data.currentIndex == 0) && (this.data.ListUserPhone.length == 0)) || ((this.data.currentIndex == 1) && (this.data.ListUserSoc.length == 0)) || ((this.data.currentIndex == 2) && (this.data.ListUserKnowledge.length == 0))) {
            this.setData({
                flag: 1,
                loading: false
            })
        } else {
            this.setData({
                flag: -1,
                loading: true
            })
        }
    }
});