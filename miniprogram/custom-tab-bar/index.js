// custom-tab-bar/index.js
let index = 0
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        index: null,
        tabBar: [{
                index: 0,
                pagePath: "/pages/home/home",
                name: '主页',
                icon: '../images/home.png',
                selectedicon: '../images/home-c.png'
            },
            {
                index: 1,
                pagePath: "/pages/phones/phones",
                name: '手机',
                icon: '../images/phones.png',
                selectedicon: '../images/phones-c.png'
            },
            {
                index: 2,
                pagePath: "/pages/knowledge/knowledge",
                name: '科普',
                icon: '../images/knowledge.png',
                selectedicon: '../images/knowledge-c.png'
            },
            {
                index: 3,
                pagePath: "/pages/me/me",
                name: '我的',
                icon: '../images/me.png',
                selectedicon: '../images/me-c.png'
            }
        ]
    },




    /**
     * 组件的方法列表
     */
    methods: {
        goto: function (e) {
            if (e.currentTarget.dataset.index != this.data.index) {
                // this.setData({
                //     index: e.currentTarget.dataset.index
                // })
                wx.switchTab({
                    url: this.data.tabBar[e.currentTarget.dataset.index].pagePath
                })
            }
        }
    }
})