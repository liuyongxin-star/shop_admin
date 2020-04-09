import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import JSZip from 'jszip'
//格式化时间
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  if (!time) {
    return ''
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    // 判断时毫秒还是字符串
    time = typeof time === 'number' ? time : ('' + time).trim()
    // 如果是秒级单位则转成毫秒
    if (/^\d{10}$/.test(time)) {
      time = parseInt(time) * 1000
    } else if (/(\d){4}-(\d){2}-(\d){2}\s+(\d){2}:(\d){2}:(\d){2}/.test(time)) {
      // IE需要标准格式
      // time = time.replace(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/, '$1-$2-$3T$4:$5:$6Z')
      time = time.replace(/-/g, '/')
    }

    date = new Date(time)
  }
  // 如果不能正确转换，则返回原有的数据
  if (date.toString().indexOf('Invalid') !== -1) {
    return time
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a')
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 删除对象空属性
export function format_objKey(obj) {
  let formatObj = obj
  for (let key in formatObj) {
    if (
      formatObj[key] === '' ||
      formatObj[key] === null ||
      formatObj[key] == '---' ||
      formatObj[key] == 'undefined' ||
      formatObj[key] == undefined
    ) {
      delete formatObj[key]
    }
  }
  return formatObj
}
// 导出表格
export function exportExcel(target, fileName = '', asZip = false) {
  var xlsxParam = { raw: true } //转换成excel时，使用原始的格式
  var wb = XLSX.utils.table_to_book(document.querySelector(target), xlsxParam)
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  let exportFileName = fileName != '' ? fileName + '.xlsx' : '订单数据表格.xlsx'
  try {
    if (!asZip) {
      //不保存为zip ，为excel
      FileSaver.saveAs(
        //保存到本地
        new Blob([wbout], { type: 'application/octet-stream;charset=utf-8' }),
        exportFileName
      )
    } else {
      //保存为zip， 导出数据内容，再调用zip文件添加，压缩
      return wbout
    }
  } catch (e) {
    if (typeof console !== 'undefined') window.console.log(e, wbout)
  }
  return wbout
}

//打包excel 为zip包
export function addFileToZip(fileList, wbout, zipName) {
  const zip = new JSZip()
  for (let i = 0; i < fileList.length; i++) {
    zip.file(fileList[i] + '.xlsx', wbout) //添加文件到zip包中
  }
  // 异步生成压缩文件
  zip.generateAsync({ type: 'blob' }).then(function(content) {
    // 保存到本地
    FileSaver.saveAs(content, zipName + '.zip')
  })
}
// 天数,时分秒倒计时
/**
 *
 * @param {*} id dom id`
 * @param {*} endDateStr '2019-01-20 8:00:00'
 */
export function TimeDown(id, endDateStr) {
  if (document.getElementById(id)) {
    //结束时间
    let endDate = new Date(endDateStr)
    //当前时间
    let nowDate = new Date()
    //相差的总秒数
    let totalSeconds = parseInt((endDate - nowDate) / 1000)
    //天数
    let days = Math.floor(totalSeconds / (60 * 60 * 24))
    if (days < 0) {
      days = 0
    }
    //取模（余数）
    let modulo = totalSeconds % (60 * 60 * 24)
    //小时数
    let hours = Math.floor(modulo / (60 * 60))
    if (hours < 0) {
      hours = 0
    }
    modulo = modulo % (60 * 60)
    //分钟
    let minutes = Math.floor(modulo / 60)
    if (minutes < 0) {
      minutes = 0
    }
    //秒
    let seconds = modulo % 60
    if (seconds < 0) {
      seconds = 0
    }
    //输出到页面
    document.getElementById(id).innerHTML =
      '' + days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒'
    //延迟一秒执行自己
    setTimeout(function() {
      TimeDown(id, endDateStr)
    }, 1000)
  }
}

//自定义属性排序
export function sortAttr(attrName) {
  return (obj1, obj2) => {
    let val1 = obj1[attrName]
    let val2 = obj2[attrName]
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}

//一维数组转多维数组
export function dealWithData(data) {
  let c = []
  let d = {}
  data.forEach(element => {
    if (!d[element.store_name]) {
      c.push({
        store_name: element.store_name,
        allData: [element]
      })
      d[element.store_name] = element
    } else {
      c.forEach(ele => {
        if (ele.store_name == element.store_name) {
          ele.allData.push(element)
        }
      })
    }
  })
  return c
}
