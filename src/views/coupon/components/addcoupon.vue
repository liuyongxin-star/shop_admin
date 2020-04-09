  <template>
  <!--添加\编辑弹出框-->
  <el-dialog
    :visible.sync="dialogFormVisible"
    center
    width="40%"
    :close-on-click-modal="true"
    @close="handleClose"
  >
    <el-form
      :model="addForm"
      label-width="150px"
      class="dialog-form"
      ref="addForm"
      :rules="rules"
      v-loading="loading"
    >
      <el-form-item
        label="优惠券类型"
        prop="allow_member"
      >
        <el-select
          placeholder="优惠券类型"
          v-model="addForm.allow_member"
        >
          <el-option
            v-for="(value, key) in $const.COUPON_TYPE"
            :label="value"
            :value="key"
            :key="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="优惠券状态"
        prop="status"
      >
        <el-select
          placeholder="优惠券状态"
          v-model="addForm.status"
        >
          <el-option
            v-for="(value, key)  in $const.COUPON_STATE"
            :label="value"
            :value="key"
            :key="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="会员等级"
        prop="allow_level"
      >
        <el-select
          placeholder="领取会员等级"
          v-model="addForm.allow_level"
        >
          <el-option
            v-for="(value, key) in $const.MEMBER_LEVEL"
            :label="value"
            :value="key"
            :key="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="优惠券名称"
        prop="name"
      >
        <el-input
          placeholder="优惠券名称"
          v-model="addForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="优惠券编号"
        prop="serial"
        v-if="!modify"
      >
        <el-input
          placeholder="优惠券编号"
          v-model="addForm.serial"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="总发行量"
        prop="total_count"
      >
        <el-input-number
          placeholder="总发行量"
          v-model="addForm.total_count"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="面值"
        prop="discount"
      >
        <el-input-number
          placeholder="面值"
          v-model="addForm.discount"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="每人限领"
        prop="limit_count"
      >
        <el-input-number
          placeholder="每人限领"
          v-model="addForm.limit_count"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="使用门槛"
        prop="threshold"
      >
        <el-input-number
          placeholder="使用门槛"
          v-model="addForm.threshold"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="使用期限"
        prop="type"
      >
        <el-select
          placeholder="使用期限"
          v-model="addForm.type"
        >
          <el-option
            v-for="(value, key) in $const.COUPON_TIME"
            :label="value"
            :value="key"
            :key="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="领取倒计时"
        v-if="addForm.type==='duration'"
        prop="indate"
      >
        <el-input-number
          placeholder="请输入天数"
          v-model="addForm.indate"
          :min="1"
        ></el-input-number>
        <span>天</span>
      </el-form-item>
      <el-form-item
        label="限定日期"
        v-if="addForm.type==='time'"
        prop="time"
        :error="timeMsgerror"
      >
        <el-date-picker
          v-model="addForm.time"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          unlink-panels
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="使用范围"
        prop="coupon_scope"
      >
        <el-radio-group v-model="addForm.coupon_scope">
          <el-radio
            v-for="(value,key,index) in $const.COUPON_SCOPE"
            :key="index"
            :label="key"
            :value="key"
          >{{value}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        prop="category_id"
        label="商品分类"
        :error="categoryidMsgerror"
        v-if="addForm.coupon_scope === 'specifiedClassification'"
      >
        <el-table
          :data="addForm.cat"
          border
          ref="multipleTable"
          :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
          v-if="addForm.cat.length && initCat"
        >
          <template v-for="(column,index) in tableColumn">
            <el-table-column
              :key="index"
              :label="column.label"
              :prop="column.prop"
            ></el-table-column>
          </template>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="deleteCat(scope.row, scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-cascader
          ref="myCategory"
          v-model="category_id"
          :props="classify"
          @change="validateCat"
          v-else
        ></el-cascader>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('addForm')"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { parseTime } from '@/utils/methods'
import { multiclass } from '@/api/multiclass'
import { searchClassify } from '@/api/goods'
import { updateCoupon } from '@/api/coupon'
export default {
  name: 'addcoupon',
  props: {
    //控制显示与否
    show: {
      type: Boolean,
      default: false
    },
    //判断新增或修改
    modify: {
      type: Boolean,
      default: false
    },
    //修改时显示的原数据
    information: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      timeMsgerror: '',
      initCat: false,
      radio: 3,
      classifies: [],
      loading: false,
      category_id: '', //商品分类ID
      addForm: {
        //表单数据
        allow_member: '', //优惠券类型
        allow_level: '', //可领取会员等级
        name: '', //优惠券名称
        total_count: '', //总发行量
        discount: '', //面值
        limit_count: '', //每人限领
        threshold: '', //门槛
        type: '', //时间类型
        indate: '', //倒计时天数
        start_time: '', //开始时间
        end_time: '', //结束时间
        cat: [], //商品分类
        catName: [], //商品分类名
        time: '', //选取时间
        serial: '', //编号
        status: '', //状态
        product: [] //商品
      },
      //原分类数据列表
      tableColumn: [
        {
          label: '商品分类',
          prop: 'name'
        }
      ],
      //表单验证规则
      rules: {
        allow_member: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        allow_level: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        status: [{ required: true, message: '不能为空', trigger: 'change' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '不能为空', trigger: 'blur' }],
        total_count: [{ required: true, message: '不能为空', trigger: 'blur' }],
        discount: [{ required: true, message: '不能为空', trigger: 'blur' }],
        limit_count: [{ required: true, message: '不能为空', trigger: 'blur' }],
        threshold: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }],
        coupon_scope: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        indate: [{ required: true, message: '不能为空', trigger: 'blur' }],
        time: [{ required: true, message: '不能为空', trigger: 'change' }]
        // category_id:[{ required: true, message: "不能为空", trigger: "blur" }],
      },
      //多级下拉菜单
      classify: {
        checkStrictly: true,
        multiple: true,
        lazy: true,
        lazyLoad: (node, resolve) => {
          this.fetchClassify(node, resolve)
        }
      },
      categoryidMsgerror: '',
      dialogFormVisible: false
    }
  },
  watch: {
    // 控制展示
    show(value) {
      this.dialogFormVisible = value
      if (this.show) {
        this.init()
      }
    },
    // 传入原值
    information: {
      handler(cval, oval) {},
      deep: true
    }
  },
  methods: {
    //初始化数据 处理分类
    init() {
      this.categoryidMsgerror = ''
      if (this.modify) {
        this.addForm = Object.assign({}, this.information)
        this.addForm.allow_level = this.addForm.allow_level.toString()
        this.addForm.threshold = this.addForm.threshold / 100
        this.addForm.discount = this.addForm.discount / 100
        if (this.addForm.cat[0].category_id === '0') {
          this.addForm.cat = []
        } else {
          this.initCat = true
        }
      } else {
        // this.addForm.coupon_scope = 'all'
      }
      if (this.addForm.type === 'time') {
        this.addForm.time = [
          this.addForm.start_time * 1000,
          this.addForm.end_time * 1000
        ]
      }
    },
    //获取多级下拉列表
    fetchClassify(node, resolve) {
      const { level } = node
      let data
      if (node.level !== 0) {
        data = {
          family_code: node.value
        }
      }
      return searchClassify(data)
        .then(res => {
          if (res.data.data.page_list.length != 0) {
            //验证数据是否为空
            const category = res.data.data.page_list.map((value, i) => ({
              value: value.category_id,
              label: value.name
            }))
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(category)
          } else {
            resolve([])
          }
        })
        .catch(err => {})
    },
    //处理原分类值
    changeCatFn(item) {
      let arr = []
      item.forEach((el, index) => {
        arr.push(el.category_id)
      })
      return arr
    },
    // 分类数组封装
    onCategoryChange(value) {
      let arr = []
      if (value.length) {
        value.forEach((el, index) => {
          arr.push(Number(el[el.length - 1]))
        })
      }
      return arr
    },
    // 格式化数据
    saveFormat() {
      let params = Object.assign({}, this.addForm)
      if (params.type === 'time') {
        params.start_time = Number(params.time[0]) / 1000
        params.end_time = Number(params.time[1]) / 1000
      }
      // this.modify true-修改时 false-添加时
      if (this.modify) {
        params._id = params.id
        params.method = 'put'
        // initcat true-原列表有数据未删完 false-需要获取手动勾选的值
        if (this.initCat) {
          params.cat =
            params.coupon_scope === 'all' ? ['0'] : this.changeCatFn(params.cat)
        } else {
          params.cat =
            params.coupon_scope === 'all'
              ? [0]
              : this.onCategoryChange(this.category_id)
        }
      } else {
        params.method = 'post'
        params.cat =
          params.coupon_scope === 'all'
            ? [0]
            : this.onCategoryChange(this.category_id)
      }
      params.threshold = Number(params.threshold) * 100
      params.discount = Number(params.discount) * 100
      params.allow_level = Number(params.allow_level)
      delete params.time
      delete params.used
      delete params.coupon_scope
      return params
    },
    validateCat() {
      let flag = true
      /**商品分类为：指定商品 specifiedClassification需要校验是否为空
       * 修改时 如果原列表cat没有数据即initcat为false，就判断时候有勾选，没有就提示错误
       * 新增时 判断是否有勾选，没有就提示错误
       */
      this.categoryidMsgerror = ''
      this.timeMsgerror = ''
      if (this.addForm.coupon_scope === 'specifiedClassification') {
        if (this.modify) {
          if (!this.initCat) {
            if (this.category_id.length === 0) {
              this.categoryidMsgerror = '必选项'
              flag = false
            }
          }
        } else {
          if (this.category_id.length === 0) {
            this.categoryidMsgerror = '必选项'
            flag = false
          }
        }
      }
      return flag
    },
    //提交表单
    submitForm(form) {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (!this.validateCat()) {
            return
          }
          this.loading = true
          // 处理提交数据
          let params = this.saveFormat()
          updateCoupon(params)
            .then(res => {
              if (res.data.ret === 0) {
                this.$message({
                  message: this.modify ? '修改成功' : '添加成功',
                  type: 'success'
                })
                this.loading = false
                this.dialogFormVisible = false
                this.$emit('success')
              } else {
                this.loading = false
                this.$message.error(this.modify ? '修改失败' : '添加失败')
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error(this.modify ? '修改失败' : '添加失败')
            })
        }
      })
    },
    //删除分类
    deleteCat(row, index) {
      this.addForm.cat.splice(index, 1)
      if (this.addForm.cat.length === 0) {
        this.initCat = false
      }
    },
    //关闭弹出框
    handleClose() {
      this.$refs['addForm'].resetFields()
      this.addForm = this.$options.data().addForm
      this.$emit('update:show', false)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.el-dialog {
  border-radius: 10px;
}
.dialog-form {
  width: 70%;
  margin: 0 auto;
}
</style>