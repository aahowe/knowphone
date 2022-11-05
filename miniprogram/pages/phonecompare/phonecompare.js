// 连接云数据库
const db = wx.cloud.database();
// 数据库操作符
const _ = db.command;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        phonedata: [],
        loading: true,
        radarData: {},
        columnData: {}
    },
    //设置图表参数
    setchart() {
        db.collection('soc').where({
            id: _.in([this.data.phonedata[0].soc_id,this.data.phonedata[1].soc_id])
        }).get().then(res=>{
            if(res.data.length == 1){
              console.log('1')
              res.data.push(res.data[0])
            }
            this.setData({
                radarData: {
                    categories: ["性能", "材质", "续航", "摄影", "生态", "屏幕"],
                    series: [{
                        name: this.data.phonedata[0].name,
                        data: this.data.phonedata[0].radar
                    }, {
                        name: this.data.phonedata[1].name,
                        data: this.data.phonedata[1].radar
                    }]
                },
                columnData: {
                    categories: ["综合性能", "CPU性能", "GPU性能"],
                    series: [{
                            name: this.data.phonedata[0].name,
                            data: [res.data[0].score, res.data[0].cpu_score, res.data[0].gpu_score]
                        },
                        {
                            name: this.data.phonedata[1].name,
                            data: [res.data[1].score, res.data[1].cpu_score, res.data[1].gpu_score]
                        }
                    ]
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
        db.collection('phone').where({
            id: _.in([options.id1,options.id2])
        }).get().then(res => {
            this.setData({
                phonedata: res.data,
                loading: false
            })
            this.setchart()
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