# SOC

- `id`soc唯一简称

- `cpu_score`cpu得分

- `cpu_spec`cpu架构

- `gb5`geekbench5得分

- `gfx5`gfxbee5.0得分

- `gpu_score`gpu得分

- `gpu_spec`gpu架构

- `icon`soc图标

- `name`英文名称

- ```json
  //手机对象数组
  phone:[
  	{
  		phonename:"手机的中文名",
  		phoneimg:"手机的图片file id",
  		id:"手机的id"
  	},
  	...
  ]
  ```

- `phone.id`搭载此soc的手机（部分）的id

- `power_gpu`gpu满载功耗

- `rate`用户评分

- `score`综合性能得分

- `zh_name`中文名称

- `type`分类（soc）

# phone

- `id`手机唯一简称
- `name`手机名称
- `img`手机图片URL
- `brand`品牌中文名
- `date`发售日期
- `radar[6]`性能得分、质感得分、生态得分、续航得分、摄影得分、屏幕得分（0-10）
- `soc`处理器中文名（与soc统一）
- `soc_id`处理器id
- `price`参考价格
- `jd`京东联盟链接
- `size`屏幕尺寸
- `resolution`屏幕分辨率
- `refresh`刷新率
- `screen`屏幕特性
- `material`外壳材质
- `size_weigth`尺寸和重量
- `battery`电池容量
- `charge`充电协议
- `fontc`前置摄像头参数
- `backc`后置摄像头参数
- `flash`闪光灯
- `camera`相机特色
- `ram`内存参数
- `rom`闪存参数
- `port`接口
- `position`位置服务
- `wlan`wifi规格
- `bluetooth`蓝牙
- `network`网络
- `sim`sim电话卡规格
- `os`初始系统
- `sensor`传感器
- `vib`震动马达
- `rate`用户评分
- `type`分类（phone）

# 科普词条(knowledge)

- `title`词条标题
- `id`词条id
- `group`科普分类

> 'camera': '相机',
>
> 'soc': 'SOC',
>
> 'screen': '屏幕',
>
> 'battery': '电池',
>
> 'ram': '内存',
>
> 'rom': '存储',
>
> 'brand': '品牌',
>
> 'look': '外观',
>
> 'communication': '通信',
>
> 'system': '系统'

- ```json
  //内容数组
  content:[
    {
      img:["配图的file id",...]
      text:"文字内容"
    },
    ...
  ]
  ```

# 用户(user)

- `_openid`用户的唯一标识（由微信分配无需手动写入）

- ```json
  //收藏列表
  star:{
  	soc:["id",...],
  	phone:["id",...],
  	knowledge:["id",...]
   }
  //数组内为id
  ```

- ```json
  //对比列表
  compare:[
  	phone:["id",...]
  ]
  //数组内为id
  ```

