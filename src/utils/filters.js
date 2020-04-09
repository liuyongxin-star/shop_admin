import {parseTime} from './methods'
// 格式化时间
export const dateFilter=(type,cformate)=>{
    return parseTime(type,cformate)
}

// 金钱转换，除以100
export const fixedMoney=(type)=>{
    if(!type||type=='---'){
        return type
    }
    let result= (Number(type)/100).toFixed(2)
    return result
}
//序号前加0
export const serialFormat = (num)=> {
    var len = num.toString().length
    while (len < 3) {
      num = '0' + num
      len++
    }
    return num
  }
  