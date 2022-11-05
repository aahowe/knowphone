Page({

    /**
     * 页面的初始数据
     */
    data: {
        gridList: [{
            "id": 1,
            "brand": "小米",
            "icon": "/images/brand/mi.png",
            "color": "#FF7E00"
        }, {
            "id": 2,
            "brand": "华为",
            "icon": "/images/brand/huawei.png",
            "color": "#ff2e63"
        }, {
            "id": 3,
            "brand": "苹果",
            "icon": "/images/brand/apple.png",
            "color": "#4B4453"
        }, {
            "id": 4,
            "brand": "荣耀",
            "icon": "/images/brand/honor.png",
            "color": "#8f31ab"
        }, {
            "id": 5,
            "brand": "三星",
            "icon": "/images/brand/samsung.png",
            "color": "#1F0660"
        }, {
            "id": 6,
            "brand": "一加",
            "icon": "/images/brand/oneplus.png",
            "color": "#C34A36"
        }, {
            "id": 7,
            "brand": "vivo",
            "icon": "/images/brand/vivo.png",
            "color": "#00C2FA"
        }, {
            "id": 8,
            "brand": "OPPO",
            "icon": "/images/brand/oppo.png",
            "color": "#00C9A4"
        }, {
            "id": 9,
            "brand": "索尼",
            "icon": "/images/brand/sony.png",
            "color": "#29272C"
        }, {
            "id": 10,
            "brand": "魅族",
            "icon": "/images/brand/meizu.png",
            "color": "#00C2FA"
        }, {
            "id": 11,
            "brand": "红米",
            "icon": "/images/brand/redmi.png",
            "color": "#FF6F91"
        }, {
            "id": 12,
            "brand": "诺基亚",
            "icon": "/images/brand/nokia.png",
            "color": "#2C73D2"
        }, {
            "id": 13,
            "brand": "realme",
            "icon": "/images/brand/realme.png",
            "color": "#fdc71d"
        }, {
            "id": 14,
            "brand": "摩托罗拉",
            "icon": "/images/brand/moto.png",
            "color": "#0A0E7F"
        }]
    },

    //转跳到品牌列表
    click(item) {
        wx.navigateTo({
            url: '/pages/brands/brands?brand=' + item.currentTarget.dataset.item.brand,
        })
    },

    //转跳到搜索页面
    gotosearch: function () {
        wx.navigateTo({
            url: '/pages/search/search?type=phone',
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
                index: 1
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