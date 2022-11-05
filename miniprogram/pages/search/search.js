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
        showhistory: false,
        historyResult: [],
        deletedialog: false,
        dialog: false,
        dialogcontent: '',
        inputValue: '',
        hasMoreBtn: false,
        childNodes: [],
        trueIndex: 0,
        result: [],
        option: [{
                text: 'SOC',
                value: 'soc'
            },
            {
                text: '手机',
                value: 'phone'
            },
            {
                text: '词条',
                value: 'knowledge'
            },
        ],
        type: '',
        showklist: false,
        showslist: false,
        showplist: false,
        loading: false,
        empty: false
    },

    //搜索事件
    onSearch(event) {
        //如果输入为空直接返回
        if (event.detail == '') {
            return
        }
        //赋值给inputdata
        this.setData({
            inputValue: event.detail
        })
        //新建搜索历史
        this.buildHistory(event.detail)
        //搜索
        this.search()
    },

    //链接数据库进行搜索
    search() {
        this.setData({
            empty: false,
            loading: true,
            showhistory: false,
            result: []
        })
        //选择搜索类型
        switch (this.data.type) {
            case 'soc':
                //弹出soc搜索列表
                this.setData({
                    showslist: true
                })
                db.collection('soc').where(_.or([{
                        zh_name: db.RegExp({
                            regexp: '.*' + this.data.inputValue,
                            options: 'i',
                        })
                    },
                    {
                        name: db.RegExp({
                            regexp: '.*' + this.data.inputValue,
                            options: 'i',
                        })
                    }
                ])).orderBy('score', "desc").get().then(res => {
                    this.setData({
                        loading: false,
                        result: res.data
                    })
                    if (res.data.length == 0) {
                        this.setData({
                            empty: true
                        })
                    } else if (res.data.length == 20) {
                        this.toomany()
                    }
                })
                break;
            case 'phone':
                //弹出soc搜索列表
                this.setData({
                    showplist: true
                })
                db.collection('phone').where(_.or([{
                        name: db.RegExp({
                            regexp: '.*' + this.data.inputValue,
                            options: 'i',
                        })
                    },
                    {
                        brand: db.RegExp({
                            regexp: '.*' + this.data.inputValue,
                            options: 'i',
                        })
                    }
                ])).orderBy('date', "desc").get().then(res => {
                    this.setData({
                        loading: false,
                        result: res.data
                    })
                    if (res.data.length == 0) {
                        this.setData({
                            empty: true
                        })
                    } else if (res.data.length == 20) {
                        this.toomany()
                    }
                })
                break;
            case 'knowledge':
                //弹出知识搜索列表
                this.setData({
                    showklist: true
                })
                db.collection('knowledge').where({
                    title: db.RegExp({
                        regexp: '.*' + this.data.inputValue,
                        options: 'i',
                    })
                }).orderBy('title', "asc").get().then(res => {
                    this.setData({
                        loading: false,
                        result: res.data
                    })
                    if (res.data.length == 0) {
                        this.setData({
                            empty: true
                        })
                    } else if (res.data.length == 20) {
                        this.toomany()
                    }
                })
                break;
            default:
                this.setData({
                    loading: false,
                    dialog: true,
                    dialogcontent: '请选择一个类别进行搜索'
                })
                break;
        }
    },

    //搜索内容过多提示
    toomany() {
        this.setData({
            dialog: true,
            dialogcontent: "请使用更加精确的关键字搜索，本次搜索只展示20条记录"
        })
    },

    //显示搜索区域
    showsearchview() {
        this.setData({
            showhistory: true
        })
    },

    // 删除历史记录缓存
    historyDelAll() {
        this.setData({
            deletedialog: true
        })
    },

    //确定删除
    delete() {
        const self = this
        wx.removeStorage({
            key: 'history',
            success: function (res) {
                self.setData({
                    historyResult: [],
                    hasMoreBtn: false,
                    showhistory: false
                })
                wx.setStorage({
                    key: "history",
                    data: [],
                })
            },
        })
    },

    // 点击最近搜索 设置源
    setInputValue(e) {
        let val = e.currentTarget.dataset.item
        this.setData({
            inputValue: val
        })
        //新建搜索历史
        this.buildHistory(val)
        //搜索
        this.search()
    },

    // 搜索超过2行折叠，最长不超过5行，超过5行则去除最早插入的数据
    toggleHistoryData() {
        let idx = 0
        let count = 0
        const self = this
        self.data.trueIndex = 0
        let ifHasMoreBtn = false
        self.data.childNodes.forEach((item, index) => {
            if (item.left === self.data.childNodes[0].left) {
                count++
                if (count < 6) {
                    if (count === 3) {
                        idx = index - 1
                        ifHasMoreBtn = true
                    }
                } else if (count === 6) {
                    // 第6行的内容
                    self.data.trueIndex = index - 1
                }
            }
        })
        let value = []
        // 超过2行
        if (idx > 0) {
            value = self.data.historyResult.slice(0, idx)
        } else {
            value = self.data.historyResult
        }
        self.setData({
            hasMoreBtn: ifHasMoreBtn,
            historyResult: value
        })
    },

    // 展开历史记录
    toggleShowMore() {
        let value = wx.getStorageSync('history') || []
        if (this.data.trueIndex != 0) {
            value = value.slice(0, this.data.trueIndex)
            wx.setStorage({
                key: 'history',
                data: value
            })
        }
        this.setData({
            hasMoreBtn: false,
            historyResult: value,
            showhistory: true
        })
    },

    // 绑定到历史搜索
    buildHistory(value) {
        const self = this
        var searchInput = value
        var searchRecord = wx.getStorageSync('history') || []
        let arrnum = searchRecord.indexOf(searchInput)
        if (arrnum == -1) {
            searchRecord.unshift(searchInput)
        } else {
            searchRecord.splice(arrnum, 1)
            searchRecord.unshift(searchInput)
        }
        wx.setStorage({
            key: 'history',
            data: searchRecord
        })
        self.setData({
            historyResult: searchRecord
        })
        self.getChildNodes()
    },

    // 获取所有子节点信息
    getChildNodes() {
        const self = this
        setTimeout(function () {
            self.createSelectorQuery().in(self).selectAll('.test-child').boundingClientRect(function (rect) {
                self.setData({
                    childNodes: rect
                })
                self.toggleHistoryData()
            }).exec()
        }, 0);
    },

    //切换搜索类别
    changetype(e) {
        this.setData({
            type: e.detail,
            showklist: false,
            showslist: false,
            showplist: false
        })
    },

    //转跳到soc详情页
    gotosoc(item) {
        wx.navigateTo({
            url: '/pages/soc/soc?id=' + item.currentTarget.dataset.item.id,
        })
    },

    //转跳到词条页面
    gotoknowledge(item) {
        wx.navigateTo({
            url: '/pages/knowledge_searchitem/knowledge_searchitem?id=' + item.currentTarget.dataset.item.id,
        })
    },

    //转跳到手机页面
    gotophone(item) {
        wx.navigateTo({
            url: '/pages/phone/phone?id=' + item.currentTarget.dataset.item.id,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //设置导航栏标题
        wx.setNavigationBarTitle({
            title: "搜索"
        })
        //获取历史记录缓存和搜索类型
        this.setData({
            historyResult: wx.getStorageSync('history') || [],
            type: options.type
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.getChildNodes()
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