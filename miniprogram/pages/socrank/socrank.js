// 连接云数据库
const db = wx.cloud.database();
// 获取集合的引用
const socCollection = db.collection('soc');
// 数据库操作符
const _ = db.command;

Page({
    data: {
        categoryData: [{
                data: [],
                end: false,
                requesting: true,
                index: 0
            },
            {
                data: [],
                end: false,
                requesting: true,
                index: 1
            },
            {
                data: [],
                end: false,
                requesting: true,
                index: 2
            }
        ],
        duration: 300, // swiper-item 切换过渡时间 
        categoryCur: 0, // 当前数据列索引 
        categoryMenu: ["综合性能", "CPU性能", "GPU性能"], // 分类菜单数据, 字符串数组格式 
        total: 0
    },
    // 顶部tab切换事件
    toggleCategory(e) {
        setTimeout(() => {
            this.setData({
                categoryCur: e.detail.index
            });
        }, 0);
    },
    // 页面滑动切换事件
    animationFinish(e) {
        setTimeout(() => {
            this.setData({
                categoryCur: e.detail.current
            });
        }, 0);
    },
    //列表刷新事件
    refresh() {
        var str = 'categoryData[' + this.data.categoryCur + '].requesting'
        //刷新动画开始
        this.setData({
            [str]: true
        })
        this.getres(this.data.categoryCur)
    },
    //下拉加载更多
    more() {
        var index = this.data.categoryCur
        var order = this.order(index)
        var array = this.data.categoryData[index].data
        socCollection.orderBy(order, "desc")
        .skip(array.length).get().then(res => {
            array = array.concat(res.data)
            var str = 'categoryData[' + index + '].data'
            this.setData({
                [str]: array,
            })
        })
        if (this.data.total <= array.length) {
            var str = 'categoryData[' + index + '].end'
            this.setData({
                [str]: true
            })
        }
    },
    //转跳到soc详情页
    gotosoc(item) {
        wx.navigateTo({
            url: '/pages/soc/soc?id=' + item.currentTarget.dataset.item.id,
        })
    },
    //获取数据
    getres(type) {
        var order = this.order(type)
        var str1 = 'categoryData[' + type + '].data'
        var str2 = 'categoryData[' + type + '].requesting'
        var str3 = 'categoryData[' + type + '].end'
        socCollection
            .orderBy(order, "desc")
            .get().then(res => {
                this.setData({
                    [str1]: res.data,
                    [str2]: false,
                    [str3]: false
                })
            })
    },
    //获取order
    order(type) {
        if (type == 0) {
            return "score"
        } else if (type == 1) {
            return "cpu_score"
        } else if (type == 2) {
            return "gpu_score"
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //设置导航栏标题
        wx.setNavigationBarTitle({
            title: "性能排行榜"
        })
        //获取集合总数
        socCollection.count().then(res => {
            this.setData({
                total: res.total
            })
        })
        //加载数据
        this.getres(0)
        this.getres(1)
        this.getres(2)
    },
})