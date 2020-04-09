// import {searchClassify} from '@/api/goods'
// //多级分类联表封装
// export const multiclass = setTimeout(() => {
//     if (node.level == 0) {
//     searchClassify().then(res => {
//          ////////console.log(res)
//     const cities = res.data.data.map((value, i) => ({
//     value: value.regionCode,
//     label: value.regionName,
//     leaf: node.level >= 2
//     }));
//     // 通过调用resolve将子节点数据返回，通知组件数据加载完成
//     resolve(cities);
//     })
//     .catch(err => {
//     ////////console.log(err);
//     });
//     }
//     if (node.level == 1) {
//     searchClassify().then(res => {
//     const areas = res.data.data.map((value, i) => ({
//     value: value.regionCode,
//     label: value.regionName,
//     leaf: node.level >= 2
//     }));
//     // 通过调用resolve将子节点数据返回，通知组件数据加载完成
//     resolve(areas);
//     })
//     .catch(err => {
//     ////////console.log(err);
//     });
//     } else if (node.level == 2) {
//     searchClassify().then(res => {
//     const partys = res.data.data.map((value, i) => ({
//     value: value.id,
//     label: value.name,
//     leaf: node.level >= 2
//     }));
//     // 通过调用resolve将子节点数据返回，通知组件数据加载完成
//     resolve(partys);
//     })
//     .catch(err => {
//     ////////console.log(err);
//     });
//     }
//     }, 1000);