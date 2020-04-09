
<template>
  <div class="ccontent">
    <!--spu设置-->
    <el-form ref="form" :model="spuList" label-width="120px" :rules="rules">
      <h3>基本信息</h3>
      <el-form-item label="商品分类" class="item-input">
        <el-cascader
          :show-all-levels="false"
          prop="category_id"
          ref="myCategory"
          :placeholder="defaultname"
          v-model="category_id"
          @change="onCategoryChange"
          :props="classify"
        ></el-cascader>
        <!-- 多级下拉菜单-->
      </el-form-item>
      <el-form-item label="商品名称" prop="name" class="item-input">
        <el-input v-model="spuList.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="数量单位" prop="name" class="item-input">
        <el-input v-model="spuList.item_pcs" size="small"></el-input>
      </el-form-item>
      <el-form-item label="商品主图" prop="spu_img">
        <!-- :on-preview="gettoken" -->
        <el-upload
          multiple
          class="upload-demo1"
          ref="upload_1"
          action="https://up-z0.qiniup.com"
          :on-success="uploadSuccesslogo"
          list-type="picture-card"
          :data="postData"
          :file-list="spuBannerList"
          :before-upload="changeMsg"
          :on-remove="dellogo"
          :on-change="checkupImg"
          :on-error="uploadError"
          accept=".png, .jpg"
        >
          <el-button size="small" slot="trigger" type="primary">点击上传图片</el-button>
        </el-upload>
        <small class="tipsText">* 建议图片为正方形，最多添加十张</small>
      </el-form-item>
      <el-form-item label="商品详情图" prop="spu_img">
        <el-upload
          multiple
          class="upload-demo2"
          ref="upload_2"
          action="https://up-z0.qiniup.com"
          :on-success="uploadSuccessimg"
          list-type="picture-card"
          :before-upload="changeMsg"
          :on-remove="dellogo"
          :on-change="checkupImg"
          :data="postData"
          :file-list="spuDetailList"
          :on-error="uploadError"
          accept=".png, .jpg"
        >
          <el-button size="small" slot="trigger" type="primary">点击上传图片</el-button>
        </el-upload>
        <small class="tipsText">* 建议图片为正方形，最多添加十张</small>
        <el-form-item label="是否重新排序">
          <el-switch
            v-model="sortlogo"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="generatingSort"
          ></el-switch>
          <el-transfer
            v-if="sortlogo"
            v-model="chooselogo"
            :data="logoList"
            target-order="push"
            :titles="['排序列表', '新排序']"
          ></el-transfer>
        </el-form-item>
      </el-form-item>

      <el-form-item label="商品状态" prop>
        <el-radio-group v-model="spuList.available">
          <el-radio :label="true">上架</el-radio>
          <el-radio :label="false">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品品牌" class="item-input" prop="brand">
        <el-input v-model="spuList.brand" size="small"></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <h3>型号价格</h3>
      <!-- sku 详情-->
      <el-table :data="skuList" border prop="product_attr" ref="form" style="width:1800px">
        <el-table-column label="规格" prop="product_attr" width="180" height="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.product_attr"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="拼单价(元)" prop="sharing_price" width="180">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sharing_price" @blur="fillSpu('sharing_price',scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单买价(元)" prop="single_price" width="180">
          <template slot-scope="scope" prop="single_price">
            <el-input v-model="scope.row.single_price" @blur="fillSpu('single_price',scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="成本价(元)" prop="purchase_price" width="180">
          <template slot-scope="scope" prop="purchase_price">
            <el-input
              v-model="scope.row.purchase_price"
              @blur="fillSpu('purchase_price',scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="货期" prop="goods_date" width="180">
          <template slot-scope="scope" prop="goods_date">
            <el-input v-model="scope.row.goods_date" @blur="fillSpu('goods_date',scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="重量(非必填)" prop="weight" width="180">
          <template slot-scope="scope" prop="weight">
            <el-input v-model="scope.row.weight" @blur="fillSpu('weight',scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="体积(非必填)" prop="volume" width="180">
          <template slot-scope="scope" prop="volume">
            <el-input v-model="scope.row.volume" @blur="fillSpu('volume',scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="180" prop="product_count">
          <template slot-scope="scope" prop="product_count">
            <el-input v-model="scope.row.product_count" @blur="fillSpu('product_count',scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品型号" width="180" prop="product_item_no">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.product_item_no"
              @blur="fillSpu('product_item_no',scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="product_img" width="300">
          <template slot-scope="scope">
            <img :src="scope.row.product_img" />
            <!--v-show="img"-->
            <el-upload
              multiple
              action="https://upload-z2.qiniup.com"
              :before-upload="changeMsg"
              :on-success="uploadSuccessSku"
              :limit="1"
              list-type="picture"
              :data="postData"
              :on-remove="delpic"
              :on-error="uploadError"
              accept=".png, .jpg"
            >
              <!--:show-file-list="false" -->
              <el-button
                size="small"
                slot="trigger"
                type="primary"
                @click="getIndex(scope.$index)"
              >点击上传图片</el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">保存</el-button>-->
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;width:100%">
        <el-form ref="operatorForm" :model="operatorForm" :inline="true">
          <el-form-item>
            <el-button @click="setTable(skuList)">新增规格</el-button>
          </el-form-item>
          <el-form-item>
            <el-select v-model="operatorForm.operate" placeholder="批量操作">
              <el-option label="拼单价" value="1"></el-option>
              <el-option label="单买价" value="2"></el-option>
              <el-option label="库存" value="3"></el-option>
              <el-option label="商品型号" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="operatorForm.input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitOperator">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-divider></el-divider>

      <!--spu价格界定-->
      <el-form-item label="拼单价(元)" class="item-input" prop="sale_price" style="margin-top:30px">
        <el-input v-model="sale_price" :disabled="sale" size="small"></el-input>
      </el-form-item>
      <el-form-item label="单买价(元)" class="item-input" prop="single_price">
        <el-input v-model="single_price" :disabled="sigle" size="small"></el-input>
      </el-form-item>
      <el-form-item label="库存" class="item-input" prop="count">
        <el-input v-model="product_count" :disabled="count" size="small"></el-input>
      </el-form-item>
      <el-form-item label="商品型号" class="item-input" prop="product_attr">
        <el-input v-model="product_item_no" :disabled="product" size="small"></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <h3>其他服务</h3>
      <el-form-item label="货期" class="item-input" prop="goods_date">
        <el-input v-model="spuList.goods_date" :disabled="product" size="small"></el-input>
      </el-form-item>

      <el-form-item label="质保期限" prop>
        <el-radio-group v-model="spuList.warranty_period">
          <el-radio label="1">1年</el-radio>
          <el-radio label="3">3年</el-radio>
          <el-radio label="99">永久</el-radio>
          <el-radio :label="warranty">
            <el-input style="width:80px" v-model="warranty" size="mini"></el-input>年
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="服务保障" prop>
        <el-checkbox-group v-model="spuList.serve_item">
          <el-checkbox label="正品行货" name="type"></el-checkbox>
          <el-checkbox label="包退换" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{_id !=undefined ?"确认修改":"立即创建"}}</el-button>
        <!-- <el-button>取消</el-button> -->
      </el-form-item>
      <el-form-item style="height:300px"></el-form-item>
    </el-form>
  </div>
</template>
<script>
import { searchClassify, addGoods, searchGoods, searchSku } from "@/api/goods";
import { uploadToken } from "@/api/uploadpic";
import { amount, checkForm, delForm, priceForm } from "@/utils/common";
import { lavender } from "color-name";
import { match } from "minimatch";
import { nextTick } from "q";
let _id; //获取修改商品拿到的_id
export default {
  created() {
    this.fetchDate();
  },
  data() {
    let _that = this;
    return {
      chooselogo: [], //当前选择的图片对象
      logoList: [], //主图排序临时存放表
      sortlogo: false, //是否启用主图排序
      sale: false,
      sigle: false,
      count: false,
      product: false,
      product_item_no: "",
      sale_price: "",
      single_price: "",
      product_count: "",
      img: false,
      defaultname: "", //默认显示分类名
      category_id: "", //获取到的分类ID
      goods_date: "", //货期输入信息
      warranty: "", //质保期限
      spuList: {
        available: true,
        spu_img: [],
        goods_date: "2个工作日内",
        warranty_period: "1",
        serve_item: ["正品行货", "包退换"]
      },
      skuList: [{}],
      skuimgList: [], //sku图片回显
      spuBannerList: [], //spu主图回显
      spuDetailList: [], //spu详情回显
      skuIndex: "", //当前操作sku索引
      //信息填写验证
      rules: {
        category_id: [
          { required: true, message: "请输入分类", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        spu_img: [{ required: true, message: "请选择图片", trigger: "change" }],
        show: [{ required: true, message: "请勾选", trigger: "change" }],
        set_sold: [{ required: true, message: "请填写此项", trigger: "blur" }],
        // product_attr: [
        //   { required: true, message: "请填写此项", trigger: "blur" }
        // ],
        sharing_price: [
          { required: true, message: "请填写此项", trigger: "blur" }
        ],
        // single_price: [
        //   { required: true, message: "请填写此项", trigger: "blur" }
        // ],
        // product_count: [
        //   { required: true, message: "请填写此项", trigger: "blur" }
        // ],
        sharing_price: [
          { required: true, message: "请填写此项", trigger: "blur" }
        ],
        // product_item_no: [
        //   { required: true, message: "请填写此项", trigger: "blur" }
        // ],
        product_img: [
          { required: true, message: "请填写此项", trigger: "blur" }
        ],
        // sale_price: [
        //   { required: true, message: "请填写此项", trigger: "blur" }
        // ],
        item_price: [
          { required: true, message: "请填写此项", trigger: "blur" }
        ],
        // count: [{ required: true, message: "请填写此项", trigger: "blur" }],
        // product_attr: [
        //   { required: true, message: "请填写此项", trigger: "blur" }
        // ],
        brand: [{ required: true, message: "请填写此项", trigger: "blur" }]
      },

      //批量操作
      operatorForm: {
        operate: "",
        input: ""
      },
      //七牛云上传
      imageurl: "",
      postData: {
        key: "",
        token: ""
      },
      //多级下拉菜单
      classify: {
        checkStrictly: true,
        multiple: false,
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (node.level == 0) {
            searchClassify() //从后台获取数据
              .then(res => {
                const category_1 = res.data.data.page_list.map((value, i) => ({
                  value: value.category_id, //设置唯一value，不能重复
                  label: value.name,
                  leaf: node.level >= 2
                }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(category_1);
              })
              .catch(err => {});
          }
          if (node.level == 1) {
            const data = {
              family_code: node.value
            };
            searchClassify(data)
              .then(res => {
                if (res.data.data.page_list.length != 0) {
                  //验证数据是否为空
                  const category_2 = res.data.data.page_list.map(
                    (value, i) => ({
                      value: value.category_id,
                      label: value.name,
                      leaf: node.level >= 2
                    })
                  );
                  // 通过调用resolve将子节点数据返回，通知组件数据加载完成

                  resolve(category_2);
                }
              })
              .catch(err => {});
          } else if (node.level == 2) {
            const data = {
              family_code: node.value
            };
            searchClassify(data)
              .then(res => {
                if (res.data.data.page_list.length != 0) {
                  //验证数据是否为空
                  const category_3 = res.data.data.page_list.map(
                    (value, i) => ({
                      value: value.category_id,
                      label: value.name,
                      leaf: node.level >= 2
                    })
                  );
                  // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                  resolve(category_3);
                }
              })
              .catch(err => {});
          }
        }
      },
      formInline: {
        user: ""
      }
    };
  },
  methods: {
    fetchDate() {
      //获取
      _id = this.$route.query._id; //获取页面返回值
      this._id = _id;
      if (_id != undefined) {
        //是否为修改信息
        this.img = true;
        if (_id != undefined && _id != "" && _id != null) {
          var data = {
            _id: _id
          };
          searchGoods(data).then(res => {
            //更新商品信息数据渲染
            const resp = res.data;
            this.spuList = priceForm(resp.data[0]); //价格处理除以100
            this.sale_price = this.spuList.sale_price; //底部四个输入框回显开始
            this.single_price = this.spuList.single_price;
            this.product_count = this.spuList.count;
            this.product_item_no = this.spuList.product_attr; //底部四个输入框回显结束
            this.spuList.spu_img.forEach(item => {
              //回显图片banner
              if (item.img_type == 1) {
                //验证图片放置区域 1为banner  2为详情
                this.spuBannerList.push({
                  url: item.img_url,
                  img_type: 1
                });
              } else {
                this.spuDetailList.push({
                  url: item.img_url,
                  img_type: 2
                });
              }
            });
            let sku = {
              spu: resp.data[0].spu_id
            };
            searchSku(sku).then(res => {
              //查询sku
              this.skuList = priceForm(res.data.data); //价格处理除以100
              this.skuList.forEach(item => {
                if (item.sharing_price > 1) {
                  //禁用按钮
                  this.sale = true;
                }
                if (item.single_price > 1) {
                  this.sigle = true;
                }
                if (item.product_count > 1) {
                  this.count = true;
                }
                if (item.product_item_no != undefined) {
                  this.product = true;
                }
                //回显sku图片
                this.skuimgList.push({
                  url: item.product_img
                });
              });
            });
            let category_; //回显分类 临时处理 开始
            if (resp.data[0].category_1) {
              category_ = resp.data[0].category_1;
              if (resp.data[0].category_2) {
                category_ = resp.data[0].category_2;
                if (resp.data[0].category_3) {
                  category_ = resp.data[0].category_3;
                }
              }
            }
            let classify = {
              category_id: category_
            };
            searchClassify(classify).then(res => {
              this.defaultname = res.data.data.page_list[0].name;
            }); //回显分类 临时处理 结束
            this.total = resp.msg.count; //当前页面总数
          });
        }
      }
    },
    generatingSort() {
      //启用图片排序
      let data = [];
      this.spuList.spu_img.forEach((item, index) => {
        if (item.img_type == 2) {
          item.index = index;
          data.push({
            key: index,
            label: item.name,
            disabled: false,
            img_url: item.img_url
          });
        }
      });
      this.logoList = data;
    },
    fillSpu(key, val) {
      //sku输入信息对比spu校验与判断是否禁用底部输入框
      this.$nextTick(() => {
        //解决element 异步组件缓存问题
        let cash = []; //缓存数组，计算最小值
        let reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/; //正则验证输入是否为金额
        this.skuList.forEach(item => {
          // this.compareSku(key, item);
          switch (key) {
            case "sharing_price": //处理拼单价最小值，并验证是否为金额
              if (!reg.test(item[key])) {
                this.$message({
                  message: "请输入正确的金额",
                  duration: 3000,
                  type: "error"
                });
              }
              if (
                item[key] != undefined &&
                item[key] != null &&
                item[key] != ""
              ) {
                //输入不为空，放入判断数组
                cash.push(item[key]);
              }
              this.sale_price = Math.min.apply(null, cash); // 计算最小值,赋给sale_price
              if (cash == null || cash == undefined || cash.length == 0) {
                //验证缓存数组是否有值，没有则修改sale_price并允许输入
                this.sale_price = "";
                this.sale = false;
              } else {
                this.sale = true;
              }
              break;
            case "single_price":
              if (!reg.test(item[key])) {
                this.$message({
                  message: "请输入正确的金额",
                  duration: 3000,
                  type: "error"
                });
              }
              if (
                item[key] != undefined &&
                item[key] != null &&
                item[key] != ""
              ) {
                //输入不为空，放入判断数组
                cash.push(item[key]);
              }
              this.single_price = Math.min.apply(null, cash); // 计算最小值,赋给sale_price
              if (cash == null || cash == undefined || cash.length == 0) {
                //验证缓存数组是否有值，没有则修改sale_price并允许输入
                this.single_price = "";
                this.sigle = false;
              } else {
                this.sigle = true;
              }
              break;
           case "purchase_price":
              if (!reg.test(item[key])) {
                this.$message({
                  message: "请输入正确的金额",
                  duration: 3000,
                  type: "error"
                });
              }
              break;
              
            case "goods_date":
              if (
                item[key] != undefined &&
                item[key] != null &&
                item[key] != ""
              ) {
                //输入不为空，放入判断数组
                cash.push(item[key]);
              }
              this.spuList.goods_date = cash[0]; 

              if (cash == null || cash == undefined || cash.length == 0) {
                //验证缓存数组是否有值，没有则修改sale_price并允许输入
                this.spuList.goods_date = "";
                // this.spuList.goods_date = false;
              } else {
                // this.spuList.goods_date = true;
              }
              break;
            case "product_item_no": //型号
              if (
                item[key] != undefined &&
                item[key] != null &&
                item[key] != ""
              ) {
                //输入不为空，放入判断数组
                cash.push(item[key]);
              } else {
                this.$message({
                  message: "请输入正确的内容",
                  duration: 3000,
                  type: "error"
                });
              }
              this.product_item_no = cash[0];
              if (cash == null || cash == undefined || cash.length == 0) {
                //验证缓存数组是否有值，没有则修改sale_price并允许输入
                this.product_item_no = "";
                this.product = false;
              } else {
                this.product = true;
              }
              break;
            case "product_count": //库存
              if (
                item[key] != undefined &&
                item[key] != null &&
                item[key] != ""
              ) {
                //输入不为空，放入判断数组
                cash.push(item[key]);
              } else {
                this.$message({
                  message: "请输入正确的内容",
                  duration: 3000,
                  type: "error"
                });
              }
              this.product_count = 0;
              cash.forEach(list1 => {
                this.product_count += list1 * 1;
              });

              if (cash == null || cash == undefined || cash.length == 0) {
                //验证缓存数组是否有值，没有则修改sale_price并允许输入
                this.product_count = "";
                this.count = false;
              } else {
                this.count = true;
              }
              break;

            default:
              break;
          }
        });
      });
    },
    onSubmit() {
      //表单提交
      this.spuList.sale_price = this.sale_price; //底部四个输入框赋值
      this.spuList.single_price = this.single_price;
      this.spuList.count = this.product_count;
      this.spuList.product_attr = this.product_item_no;
      let sku = [...this.skuList];
      let spu = this.spuList;
      let data;
      if (!checkForm(sku)) {
        //验证是否有空值并为价格*100
        this.$message({
          message: "sku存在未填写",
          duration: 3000,
          type: "error"
        });
        return;
      }
      if (!checkForm(spu)) {
        //验证是否有空值为价格*100
        this.$message({
          message: "spu存在未填写",
          duration: 3000,
          type: "error"
        });
        return;
      }
      if (
        this.spuList.category_3 < 0 ||
        this.spuList.category_3 == undefined ||
        this.spuList.category_3 == "" ||
        this.spuList.category_3 == null
      ) {
        //验证是否填写分类
        this.$message({
          message: "请填写正确的第三级分类",
          duration: 3000,
          type: "error"
        });
        return;
      }
      if (sku[0].product_attr == undefined) {
        //允许sku不填写
        sku = [];
      }
      //修改图片排序
      if (this.sortlogo) {
        let list = []; //临时存储图片数组

        this.spuList.spu_img.forEach((item, index) => {
          //放置图片进入临时数组
          if (item.img_type == 2) {
            list.push(item);
          }
        });
        list.forEach((item, index) => {
          //删除原有图片
          this.spuList.spu_img.forEach((res, num) => {
            if (res.img_type == 2 && item.img_url == res.img_url) {
              this.spuList.spu_img.splice(num, 1);
            }
          });
        });
        //获取穿梭框右边的值
        this.chooselogo.forEach((item, index) => {
          //置换顺序放入原数组
          list.forEach((res, num) => {
            if (item == res.index) {
              this.spuList.spu_img.push(res);
            }
          });
        });
      }
      if (this.spuList._id != undefined) {
        //更新信息
        // spu= delForm(spu)// 删除spu多余空字段
        // sku = delForm(sku)//删除sku多余空字段
        data = {
          method: "update",
          Spu: spu,
          Sku: sku
        };
      } else {
        data = {
          method: "post",
          Spu: spu,
          Sku: sku
        };
      }
      addGoods(data).then(res => {
        if (res.data.ret == "0") {
          this.$alert("添加成功", {
            confirmButtonText: "确定",
            callback: action => {
              // this.$message({
              //   type: "info",
              //   message: `action: ${action}`
              // });
              location.reload();
            }
          });
        } else {
          this.$message({
            message: "添加失败请检查网路设置",
            duration: 3000,
            type: "error"
          });
        }
        priceForm(spu); //价格/100
        priceForm(sku); //价格/100
      });
    },
    //新增table
    setTable(skuList) {
      skuList.push({
        product_attr: "", //规格
        single_price: "", //单独售价
        sharing_price: "", //拼单价
        product_count: "", //库存
        product_item_no: "", //商品型号
        product_img: "" //sku图片
      });
    },
    //删除 table
    handleDelete(index, rows) {
      this.skuList.splice(index, 1);
      this.fillSpu("sharing_price");
      this.fillSpu("single_price");
      this.fillSpu("product_count");
      this.fillSpu("product_item_no");
      this.fillSpu("goods_date");
    },
    //批量操作
    submitOperator() {
      let type = Number(this.operatorForm.operate);
      let input = this.operatorForm.input;
      switch (type) {
        case 1:
          this.skuList.forEach(item => {
            item.sharing_price = input;
          });
          this.fillSpu("sharing_price");
          break;
        case 2:
          this.skuList.forEach(item => {
            item.single_price = input;
          });
          this.fillSpu("single_price");
          break;
        case 3:
          this.skuList.forEach(item => {
            item.product_count = input;
          });
          this.fillSpu("product_count");
          break;
        case 4:
          this.skuList.forEach(item => {
            item.product_item_no = input;
          });
          this.fillSpu("product_item_no");
          break;
        default:
          alert("匹配操作出错");
          break; //最后一个default可以不写break，但建议写上
      }
    },
    onCategoryChange() {
      //下拉分类点击事件
      //(this.category_id,"id")//选中的所有分类id
      //(this.$refs.myCategory.getCheckedNodes(),"myCategory")//选中的所有数据
      //将获取到的分类ID保存到要发送的数据中出去
      let category = this.category_id;
      category.forEach(item => {
        if (item * 1 < 100) {
          this.spuList.category_1 = item;
        } else if (item * 1 > 100 && item * 1 < 10000) {
          this.spuList.category_2 = item;
        } else if (item * 1 > 10000) {
          this.spuList.category_3 = item;
        }
      });
    },
    //七牛图片上传
    gettoken(param) {
      //图片点击选择
      let _that = this;
      let key = param.name;
      uploadToken(key).then(res => {
        //获取token
        _that.postData.key = key;
        _that.postData.token = res.data.data.upToken;
      });
    },
    changeMsg(file) {
      //上传前回调
      let _that = this;
      let type = false; //回调参数，before -upload 返回 为false 上传终止，利用特性解决获取token异步问题
      type = uploadToken(file.name).then(res => {
        if (res.data.ret == 0) {
          _that.postData = { key: file.name, token: res.data.data[2] };
          return true;
        } else {
          return false;
        }
      });
      return type;
    },
    uploadSuccessimg(res, file, flielist) {
      //上传成功详情
      var url = "http://q7653j6x1.bkt.clouddn.com/" + res.key; //图片地址拼接
      this.spuList.spu_img.push({
        img_url: url,
        name: res.key,
        img_type: 2 //1是商品banner 2是商品详情
      });
      (file.url = url), (file.img_type = 2);
    },
    uploadSuccesslogo(res, file, filelist) {
      //上传成功主图
      var url = "http://q7653j6x1.bkt.clouddn.com/" + res.key; //图片地址拼接
      this.spuList.spu_img.push({
        img_url: url,
        name: res.key,
        img_type: 1 //1是商品banner 2是商品详情
      });
      (file.url = url), (file.img_type = 1);
    },
    getIndex(index) {
      //点击事件发生获取当前选择行
      this.skuIndex = index;
    },
    uploadSuccessSku(response, file, filelist) {
      //上传成功sku
      var url = "http://q7653j6x1.bkt.clouddn.com/" + response.key; //图片地址拼接
      this.skuList[this.skuIndex].product_img = url; //图片赋值到skulist
      file.url = url;
    },
    dellogo(file, fileList) {
      //删除图片操作
      this.spuList.spu_img.forEach((item, index) => {
        if (file.img_type == item.img_type && file.url == item.img_url) {
          this.spuList.spu_img.splice(index, 1);
        }
      });
    },
    checkupImg(flie) {
      if (this.spuList.spu_img.length > 20) {
        this.message({
          message: "图片文件过多",
          duration: 3000,
          type: "error"
        });
        return false;
      }
    },
    delpic(file, filelist) {
      //删除sku图片
      this.$nextTick(() => {
        this.skuList.forEach((item, index) => {
          if (item.img_url == file.url) {
            this.skuList[index].product_img = "";
          }
        });
      });
    },
    uploadError(res) {
      //上传失败
    }
  }
};
</script>
<style scoped>
.tipsText {
  color: #999999;
}
.tipsHover {
  color: #ff6725;
  margin-left: 20px;
}
.tipsimg {
  width: 300px;
  height: 400px;
  position: absolute;
  top: -200px;
  left: 320px;
}
.tipsHover > .tipsimg {
  display: none;
}
.tipsHover:hover {
  text-decoration: underline;
}
.demo-form-inline {
  width: 600px;
  border: 1px solid rgba(49, 24, 24, 0.2);
  min-height: 200px;
  padding: 10px;
}
.ccontent {
  width: 1000px;
  margin: 0 auto;
}
.item-input {
  width: 400px;
}
/* 修改默认element 样式*/
.ccontent >>> .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  height: auto;
}
.ccontent >>> .cell > img {
  width: 100px;
}
</style>