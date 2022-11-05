// app.js
App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
        } else {
            wx.cloud.init({
                env: 'a-5gbhyzpd5bd8e0e5',
            });
        }
        //获取缓存中的openid
        var openid = wx.getStorageSync('openid')
        this.globalData.openid = openid
    },
    globalData: {
        openid: ''
    },
});