// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化云能力
cloud.init({
    env: 'a-5gbhyzpd5bd8e0e5'
})
// 连接云数据库
const db = cloud.database()
// 数据库操作符
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    if (event.ratecount == null) {
        //如果此手机的ratecount为空则创建新字段
        db.collection('phone').where({
            id: event.id
        }).update({
            data: {
                ratecount: 1,
                rate: event.score
            }
        })
    } else {
        //重新计算评分
        var newrate = (event.rate * event.ratecount + event.score) / (event.ratecount + 1)
        db.collection('phone').where({
            id: event.id
        }).update({
            data: {
                rate: newrate,
                ratecount: event.ratecount + 1
            }
        })
    }
}