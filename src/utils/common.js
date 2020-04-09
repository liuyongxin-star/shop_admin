import { isArray } from 'util'

export function amount(val, value, callback) {
    //验证是否为正数或保留两位小数
    let reg = /^\d+(\.\d{1,2})?$/
    let price = reg.test(value)
    if (!price) {
        alert('请输入正确金额')
    }
    return true
}
export function checkForm(obj) {
    //验证是否有未填写
    let formatObj = obj
    let skuimgNum = 0 //校验图片是否存在
    let spuimgType1 = 0 //校验商品图片存在
    let spuimgType2 = 0 //校验详情图片存在
    if (isArray(formatObj)) {
        for (var i = 0; i < formatObj.length; i++) {
            //sku
            var element = formatObj[i]
            for (let num in element) {
                if (
                    num == 'sale_price' ||
                    num == 'item_price' ||
                    num == 'single_price' ||
                    num == 'sharing_price' ||
                    num == 'sigle_price'
                ) {
                    element[num] = parseInt(element[num] * 10 * 10) //保留整数
                }
                if (num == 'product_img') {
                    skuimgNum++
                }
                if (num != 'removed') {
                    //排除是否移除
                    if (num != 'show') {
                        //排除是否显示
                        if (num != 'vip_area') {
                            if (num != 'real_sold') {
                                if (num != 'pre_no') {
                                    if (num != 'weight') {
                                        if (num != 'goods_date') {
                                            if (num != 'volume') {
                                                if (
                                                    element[num] == '' ||
                                                    element[num] == null ||
                                                    element[num] == 0
                                                ) {
                                                    //验证是否有为空
                                                    window.console.log(num)
                                                    return false
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //循环外检查图片存在数量
        if (skuimgNum < 1) {
            window.console.log("bb")
            return false

        }
    } else {
        for (let key in formatObj) {
            if (key == 'spu_img') {
                //循环校验图片是否存在
                let spu_img = formatObj[key]
                for (let j in spu_img) {
                    if (spu_img[j].img_type == 1 || spu_img[j].img_type == '1') {
                        spuimgType1++
                    } else if (spu_img[j].img_type == 2 || spu_img[j].img_type == '2') {
                        spuimgType2++
                    }
                }
            }
            if (key != 'show') {
                //spu
                if (key != 'real_sold') {
                    if (
                        key == 'sale_price' ||
                        key == 'item_price' ||
                        key == 'single_price' ||
                        key == 'sharing_price' ||
                        key == 'sigle_price'
                    ) {
                        formatObj[key] = parseInt(formatObj[key] * 10 * 10) //保留整数
                    }
                    if (key != 'available') {
                        //排除单选
                        if (key != 'removed') {
                            //排除是否移除
                            if (key != 'vip_area') {
                                if (key != 'real_sold') {
                                    if (key != 'pre_no') {
                                        if (key != 'weight') {
                                            if (key != 'goods_date') {
                                                if (key != 'volume') {
                                                    if (
                                                        formatObj[key] == '' ||
                                                        formatObj[key] == null ||
                                                        formatObj[key] == 0
                                                    ) {
                                                        //验证是否有为空
                                                        window.console.log(key)
                                                        window.console.log(formatObj)
                                                        return false
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (spuimgType1 < 1 || spuimgType2 < 1) {
            window.console.log(obj)
            window.console.log("aa")
            return false
        }
    }
    return true
}
export function priceForm(obj) {
    //渲染价格/100
    let formatObj = obj
    if (isArray(formatObj)) {
        for (var i = 0; i < formatObj.length; i++) {
            var element = formatObj[i]
            for (let num in element) {
                if (
                    num == 'sale_price' ||
                    num == 'item_price' ||
                    num == 'single_price' ||
                    num == 'sharing_price' ||
                    num == 'sigle_price'
                ) {
                    element[num] = (element[num] / 100).toFixed(2)
                }
            }
        }
    } else {
        for (let key in formatObj) {
            if (key != 'show') {
                if (key != 'available') {
                    if (
                        key == 'sale_price' ||
                        key == 'item_price' ||
                        key == 'single_price' ||
                        key == 'sharing_price' ||
                        key == 'sigle_price'
                    ) {
                        formatObj[key] = (formatObj[key] / 100).toFixed(2)
                    }
                }
            }
        }
    }
    return formatObj
}
export function delForm(obj) {
    //删除sku spu 空字段
    let formatObj = obj
    if (isArray(formatObj)) {
        for (var i = 0; i < formatObj.length; i++) {
            var element = formatObj[i]
            for (let num in element) {
                if (element[num] == '' || element[num] == null) {
                    return false
                }
            }
        }
    } else {
        for (let key in formatObj) {
            if (key != 'show') {
                if (formatObj[key] == '' || formatObj[key] == null) {
                    return false
                }
            }
        }
    }
}