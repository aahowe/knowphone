// 连接云数据库
const db = wx.cloud.database();
// 数据库操作符
const _ = db.command;
// 聚合操作符
const $ = db.command.aggregate

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //卡片序号
        index: 0,
        //卡片是否显示
        show0: true,
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        //卡片动画延迟
        duration: {
            enter: 300,
            leave: 300
        },
        //是否倒叙播放动画
        back: false,
        //查询请求数组
        request: {
            cost: {
                min: '',
                max: ''
            },
            os: '',
            performance: '',
            screen: ''
        },
        //问题数组
        question1: [{
            name: {
                min: 0,
                max: 2000
            },
            text: '小于2000元',
            index: 1
        }, {
            name: {
                min: 2000,
                max: 3000
            },
            text: '2000-3000元',
            index: 1
        }, {
            name: {
                min: 3000,
                max: 4000
            },
            text: '3000-4000元',
            index: 1
        }, {
            name: {
                min: 4000,
                max: 5000
            },
            text: '4000-5000元',
            index: 1
        }, {
            name: {
                min: 5000,
                max: 6000
            },
            text: '5000-6000元',
            index: 1
        }, {
            name: {
                min: 6000,
                max: 999999
            },
            text: '6000元以上',
            index: 1
        }],
        question2: [{
            name: 'ios',
            text: '苹果',
            index: 2
        }, {
            name: 'android',
            text: '安卓',
            index: 2
        }, {
            name: 'no',
            text: '没有要求',
            index: 2
        }],
        question3: [{
            name: 'yes',
            text: '是的',
            index: 3
        }, {
            name: 'no',
            text: '不是',
            index: 3
        }],
        question4: [{
            name: 'big',
            text: '屏幕偏大的',
            index: 4
        }, {
            name: 'small',
            text: '屏幕偏小的',
            index: 4
        }, {
            name: 'no',
            text: '没有要求',
            index: 4
        }],
        //顶部弹出提示
        showmessage: false,
        message: '',
        messagetype: '',
        //手机结果数组
        result: [],
        //查询是否成功
        success: false,
        empty: false
    },

    //步骤条下一步
    next() {
        this.setData({
            back: false
        })
        switch (this.data.index) {
            case 0:
                this.setData({
                    show0: false
                })
                setTimeout(() => {
                    this.setData({
                        show1: true
                    });
                }, this.data.duration.enter);
                break;
            case 1:
                this.setData({
                    show1: false
                })
                setTimeout(() => {
                    this.setData({
                        show2: true
                    });
                }, this.data.duration.enter);
                break;
            case 2:
                this.setData({
                    show2: false
                })
                setTimeout(() => {
                    this.setData({
                        show3: true
                    });
                }, this.data.duration.enter);
                break;
            case 3:
                this.setData({
                    show3: false
                })
                setTimeout(() => {
                    this.setData({
                        show4: true
                    });
                }, this.data.duration.enter);
                break;
            case 4:
                if (this.data.request.cost == '' || this.data.request.os == '' || this.data.request.performance == '' || this.data.request.screen == '') {
                    this.setData({
                        showmessage: true,
                        message: '您还有问题未选择答案',
                        messagetype: 'warning',
                        index: this.data.index - 1
                    })
                } else {
                    this.setData({
                        show4: false
                    })
                    setTimeout(() => {
                        this.setData({
                            show5: true,
                            success: false,
                            empty: false,
                            result: ''
                        });
                    }, this.data.duration.enter);
                    //搜索手机
                    this.search()
                }
                break;
        }
        this.setData({
            index: this.data.index + 1
        })
    },

    //步骤条上一步
    previous() {
        this.setData({
            back: true
        })
        switch (this.data.index) {
            case 1:
                this.setData({
                    show1: false
                })
                setTimeout(() => {
                    this.setData({
                        show0: true
                    });
                }, this.data.duration.enter);
                break;
            case 2:
                this.setData({
                    show2: false
                })
                setTimeout(() => {
                    this.setData({
                        show1: true
                    });
                }, this.data.duration.enter);
                break;
            case 3:
                this.setData({
                    show3: false
                })
                setTimeout(() => {
                    this.setData({
                        show2: true
                    });
                }, this.data.duration.enter);
                break;
            case 4:
                this.setData({
                    show4: false,
                })
                setTimeout(() => {
                    this.setData({
                        show3: true
                    });
                }, this.data.duration.enter);
                break;
            case 5:
                this.setData({
                    show5: false
                })
                setTimeout(() => {
                    this.setData({
                        show4: true
                    });
                }, this.data.duration.enter);
                break;
        }
        this.setData({
            index: this.data.index - 1
        })
    },

    //点击选项
    select(item) {
        switch (item.currentTarget.dataset.item.index) {
            case 1:
                this.setData({
                    'request.cost': item.currentTarget.dataset.item.name
                })
                break;
            case 2:
                this.setData({
                    'request.os': item.currentTarget.dataset.item.name
                })
                break;
            case 3:
                this.setData({
                    'request.performance': item.currentTarget.dataset.item.name
                })
                break;
            case 4:
                this.setData({
                    'request.screen': item.currentTarget.dataset.item.name
                })
                break;
        }
    },

    //按照限定条件搜索符合的手机
    search() {
        db.collection('phone').where({
            //价格限定
            price: _.and(_.gte(this.data.request.cost.min), _.lte(this.data.request.cost.max)),
            //系统限定
            brand: (this.data.request.os == 'ios') ? ('苹果') : ((this.data.request.os == 'android') ? (_.nin(['苹果'])) : (_.nin([]))),
            //性能限定
            'radar.0': (this.data.request.performance == 'yes') ? (_.gt(5)) : (_.gt(0)),
            //屏幕限定
            size: (this.data.request.screen == 'big') ? (_.gt(6.5)) : ((this.data.request.screen == 'small') ? (_.lt(6.5)) : (_.gt(1))),
            //发布日期限定
            date: _.gt('2021')
        }).orderBy('rate','desc').get().then(res => {
            //显示动画
            setTimeout(() => {
                if (res.data.length == 0) {
                    this.setData({
                        empty: true,
                        success: true
                    })
                } else {
                    this.setData({
                        result: res.data,
                        success: true
                    })
                }
            }, 1000)
        })
    },

    //转跳到手机页面
    gotophone(item) {
        wx.navigateTo({
            url: '/pages/phone/phone?id=' + item.currentTarget.dataset.item.id,
        })
    },

    //重新开始
    restart() {
        this.setData({
            index: 0,
            request: {
                cost: {
                    min: '',
                    max: ''
                },
                os: '',
                performance: '',
                screen: ''
            },
            show5: false,
        })
        setTimeout(() => {
            this.setData({
                success: false,
                empty: false,
                show0: true
            })
        }, 300)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
          title: '手机智能推荐',
        })
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})