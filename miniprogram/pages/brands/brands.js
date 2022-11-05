// 连接云数据库
const db = wx.cloud.database();
// 获取集合的引用
const phoneCollection = db.collection('phone');
// 数据库操作符
const _ = db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        brand: '',
        date: '',
        priceorder: '',
        datelist: [{
            text: '全部',
            value: '全部'
        }, {
            text: '2022',
            value: '2022'
        }, {
            text: '2021',
            value: '2021'
        }, {
            text: '2020',
            value: '2020'
        }, {
            text: '2019',
            value: '2019'
        }, {
            text: '2018',
            value: '2018'
        }, {
            text: '2017',
            value: '2017'
        }, {
            text: '更早',
            value: '更早'
        }],
        pricelist: [{
            text: '价格降序',
            value: 'desc'
        }, {
            text: '价格升序',
            value: 'asc'
        }],
        result: [],
        empty: false,
        loading: true,
        loadtype: 'loading'
    },

    //转跳到手机页面
    gotophone(item) {
        wx.navigateTo({
            url: '/pages/phone/phone?id=' + item.currentTarget.dataset.item.id,
        })
    },

    //发售日期更改
    changedate(e) {
        if (this.data.priceorder == '') {
            this.setData({
                priceorder: 'desc'
            })
        }
        this.setData({
            date: e.detail,
            empty: false,
            loading: true,
            loadtype: 'loading',
            result: []
        })
        //更新数据列表
        this.update()
    },

    //价格排序更改
    changeorder(e) {
        if (this.data.date == '') {
            this.setData({
                date: '全部'
            })
        }
        this.setData({
            priceorder: e.detail,
            empty: false,
            loading: true,
            loadtype: 'loading',
            result: []
        })
        //更新数据列表
        this.update()
    },

    //更新数据
    update() {
        //根据日期选择方法
        switch (this.data.date) {
            default:
                phoneCollection.where(_.and([{
                    date: db.RegExp({
                        regexp: '.*' + this.data.date,
                        options: 'i',
                    })
                }, {
                    brand: this.data.brand
                }])).orderBy('price', this.data.priceorder).get().then(res => {
                    this.setData({
                        result: res.data,
                        loading: false
                    })
                    if (res.data.length == 0) {
                        this.setData({
                            empty: true
                        })
                    }
                })
                break;
            case '更早':
                phoneCollection.where(_.and([{
                    date: _.lt('2017')
                }, {
                    brand: this.data.brand
                }])).orderBy('price', this.data.priceorder).get().then(res => {
                    this.setData({
                        result: res.data,
                        loading: false
                    })
                    if (res.data.length == 0) {
                        this.setData({
                            empty: true
                        })
                    }
                })
                break;
            case '全部':
                phoneCollection.where({
                    brand: this.data.brand
                }).orderBy('price', this.data.priceorder).get().then(res => {
                    this.setData({
                        result: res.data,
                        loading: false,
                    })
                    if (res.data.length == 0) {
                        this.setData({
                            empty: true
                        })
                    }
                })
                break;
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //设置导航栏标题
        wx.setNavigationBarTitle({
            title: options.brand
        })
        //加载所有手机
        phoneCollection.where({
            brand: options.brand
        }).orderBy('date', 'desc').get().then(res => {
            this.setData({
                result: res.data,
                brand: options.brand,
                loading: false
            })
            if (res.data.length == 0) {
                this.setData({
                    empty: true
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
        //tabbar换页
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                // 当前页面的 tabBar 索引
                index: 1
            })
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.setData({
            loading: true
        })
        var array = this.data.result
        switch (this.data.date) {
            default:
                phoneCollection.where(_.and([{
                        date: db.RegExp({
                            regexp: '.*' + this.data.date,
                            options: 'i',
                        })
                    }, {
                        brand: this.data.brand
                    }])).orderBy('price', this.data.priceorder)
                    .skip(array.length).get().then(res => {
                        if (res.data.length == 0) {
                            this.setData({
                                loadtype: 'end'
                            })
                        }
                        array = array.concat(res.data)
                        this.setData({
                            result: array,
                        })
                    })
                break;
            case '更早':
                phoneCollection.where(_.and([{
                        date: _.lt('2017')
                    }, {
                        brand: this.data.brand
                    }])).orderBy('price', this.data.priceorder)
                    .skip(array.length).get().then(res => {
                        if (res.data.length == 0) {
                            this.setData({
                                loadtype: 'end'
                            })
                        }
                        array = array.concat(res.data)
                        this.setData({
                            result: array,
                        })
                    })
                break;
            case '全部':
                phoneCollection.where({
                        brand: this.data.brand
                    }).orderBy('price', this.data.priceorder)
                    .skip(array.length).get().then(res => {
                        if (res.data.length == 0) {
                            this.setData({
                                loadtype: 'end'
                            })
                        }
                        array = array.concat(res.data)
                        this.setData({
                            result: array,
                        })
                    })
                break;
            case '':
                phoneCollection.where({
                        brand: this.data.brand
                    }).orderBy('date', 'desc')
                    .skip(array.length).get().then(res => {
                        if (res.data.length == 0) {
                            this.setData({
                                loadtype: 'end'
                            })
                        }
                        array = array.concat(res.data)
                        this.setData({
                            result: array,
                        })
                    })
                break;
        }
    },
})