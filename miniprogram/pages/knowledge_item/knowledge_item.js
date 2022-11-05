// pages/knowledge_item/knowledge_item.js
const db = wx.cloud.database();
const _ = db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        group: "",
        dataList: "",
        num: "",
        loading: true
    },

    /**
     * 生命周期函数--监听页面加载
     */

    //转跳到词条页面
    itemClick(item) {
        wx.navigateTo({
            url: '/pages/knowledge_searchitem/knowledge_searchitem?id=' + item.currentTarget.dataset.item.id,
        })
    },

    //获取数据
    getdata() {
        db.collection('knowledge').where({
                group: this.data.group
            }).orderBy('title', "asc")
            .get().then(res => {
                // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
                this.setData({
                    dataList: res.data,
                    loading: false
                })
            })
        db.collection('knowledge').where({
            group: this.data.group
        }).count().then(res => {
            this.setData({
                num: res.total
            })
        })
    },

    onLoad(options) {
        this.setData({
            title: options.name
        })
        this.setData({
            group: options.group,
        })
        this.getdata()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        this.setData({
            loading: true
        })
        var array = this.data.dataList
        db.collection('knowledge').where({
                group: this.data.group
            }).orderBy('title', "asc")
            .skip(array.length)
            .get().then(res => {
                array = array.concat(res.data)
                this.setData({
                    dataList: array,
                    loading: false
                })
            })
    },

})