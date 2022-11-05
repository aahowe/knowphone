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
//语义理解正则表达式
const num = /\d{2,5}/g;
const price_less = /不超过|至多|以下|少|小于|之内|以内|最高|最多/g;
const price_more = /超过|至多|多于|以上|高于|贵于|更贵|之上|不低于|大于/g;
const features_game = /游戏|性能|处理器|3d|强|厉害/g;
const features_photo = /影|照|相机|录|摄/g;
const brandindex = /苹果|小米|华为|荣耀|三星|一加|vivo|oppo|索尼|魅族|红米|诺基亚|realme|摩托罗拉/g;

// 云函数入口函数
exports.main = async (event, context) => {
  var text = event.speech
  if (text.match(num)) {
    var nums = text.match(num).sort((a, b) => {
      return a - b
    }).map(Number)
  } else {
    var nums = null
  }
  var less = text.match(price_less)
  var more = text.match(price_more)
  var brand = text.match(brandindex)
  var game = text.match(features_game)
  var photo = text.match(features_photo)
  console.log(nums)
  console.log(less)
  console.log(more)
  console.log(brand)
  console.log(game)
  console.log(photo)
  if (nums == null && less == null && more == null && brand == null && game == null && photo == null) {
    //返回空数组
    return []
  } else {
    //进行查询
    return db.collection('phone').where({
      //价格条件
      price: (nums == null) ? (_.gt(0)) : ((nums.length == 1) ? ((more) ? (_.gte(nums[0])) : ((less) ? (_.lte(nums[0])) : (_.and(_.gte(nums[0] - 500), _.lte(nums[0] + 500))))) : (_.and(_.gte(nums[0]), _.lte(nums[1])))),
      //品牌条件
      brand: (brand) ? (_.in(brand)) : (_.nin([])),
      //性能条件
      'radar.0': (game) ? (_.gte(5)) : (_.gte(0)),
      //摄影条件
      'radar.3': (photo) ? (_.gte(8)) : (_.gte(0)),
      //发布日期限定
      date: _.gt('2021')
    }).orderBy('rate', 'desc').get()
  }
}