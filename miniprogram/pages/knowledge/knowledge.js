// pages/knowledge/knowledge.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gridList: [{
            "id": 1,
            "name": "SOC",
            "icon": "/images/knowledge/soc.png",
            "color": "#57bbb3",
            "group": "soc"
        }, {
            "id": 2,
            "name": "屏幕",
            "icon": "/images/knowledge/screen.png",
            "color": "#3a81f7",
            "group": "screen"
        }, {
            "id": 3,
            "name": "电池",
            "icon": "/images/knowledge/battery.png",
            "color": "#643db2",
            "group": "battery"
        }, {
            "id": 4,
            "name": "摄影",
            "icon": "cloud://a-5gbhyzpd5bd8e0e5.612d-a-5gbhyzpd5bd8e0e5-1307133961/images/knowledge/icon/camera.png",
            "color": "#8f31ab",
            "group": "camera"
        }, {
            "id": 5,
            "name": "内存",
            "icon": "/images/knowledge/ram.png",
            "color": "#cd4994",
            "group": "ram"
        }, {
            "id": 6,
            "name": "存储",
            "icon": "/images/knowledge/rom.png",
            "color": "#9d6c46",
            "group": "rom"
        }, {
            "id": 7,
            "name": "品牌",
            "icon": "/images/brand/huawei.png",
            "color": "#e4823a",
            "group": "brand"
        }, {
            "id": 8,
            "name": "外观",
            "icon": "/images/knowledge/look.png",
            "color": "#d4584c",
            "group": "look"
        }, {
            "id": 9,
            "name": "通信",
            "icon": "/images/knowledge/communication.png",
            "color": "#34839C",
            "group": "communication"
        }, {
            "id": 10,
            "name": "系统",
            "icon": "/images/knowledge/system.png",
            "color": "#4B4453",
            "group": "system"
        }]

    },

    //转跳到搜索页面
    gotosearch: function () {
        wx.navigateTo({
            url: '/pages/search/search?type=knowledge',
        })
    },

    //转跳到分类页面
    gotoitem(item) {
        wx.navigateTo({
            url: '/pages/knowledge_item/knowledge_item?group=' + item.currentTarget.dataset.item.group + '&name=' + item.currentTarget.dataset.item.name,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
                index: 2
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

    }
})