<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">用户首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" style="margin-top:10px;">
      <!-- 头部 -->
      <el-form style="margin-top: 15px;" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="showCateForm">添加分类</el-button>
        </el-form-item>
      </el-form>

      <!-- 商品列表区域 -->
      <tree
        :data="goodsList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="likes" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:green"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="active" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="bianji(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="del(scope.row)">删除</el-button>
        </template>
      </tree>
      <!-- 分页区域 -->
     
      <el-pagination
       @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
         :current-page="cateList.pagenum"
          :page-sizes="[3, 5, 10]"
           :page-size="cateList.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
             :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="分配分类" :visible.sync="cateShow" @close="addCrteClose">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef">
        <el-form-item label="分类名称" prop="cat_name" :label-width="'80px'">
          <el-input v-model="addCateForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" :label-width="'80px'">
          <!-- option用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentList"
            expand-trigger="hover"
            :props="cateProps"
            @change="panterChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cateShow = false">取 消</el-button>
        <el-button type="primary" @click="addCrte">确 定</el-button>
      </div>
    </el-dialog>

<el-dialog title="编辑分类" :visible.sync="show">
      <el-form :model="changeRoles" :rules="addCateFormRules">
        <el-form-item label="分类名称" :label-width="'80px'" prop="roleName">
          <el-input
            v-model="changeRoles.cat_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="bj">确 定</el-button>
      </div>
    </el-dialog>

    
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有商品的数据列表
      goodsList: [],
      // 商品列表传递的参数
      cateList: {
        type: 3,
        pagesize: 5, //每页显示多少条
        pagenum: 1 //显示第几页
      },
      show:false,
      total: 0,
      // 为表格定义指定列的数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          //   prop: "cat_deleted",
          type: "template",
          template: "likes"
        },
        {
          label: "排序",
          //   prop: "cat_deleted",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          //   prop: "cat_deleted",
          type: "template",
          template: "active"
        }
      ],
      // 控制分配分类的对话框
      cateShow: false,
      // 分配分类的数据
      addCateForm: {
        //  父级分类的ID
        cat_pid: 0,
        // 需要添加的分类名称
        cat_name: "",
        // 需要添加分类的等级 默认是一级
        cat_level: 0
      },
      //   父类分类的数据
      parentList: [],
      //  用来指定配置对象
      cateProps: {
        //   所选中的值
        value: "cat_id",
        //   可以看到的名称
        label: "cat_name",
        //   通过children属性查找
        children: "children"
      },
      //   选中的父级分类的ID
      selectKeys: [],
      changeRoles:{
        cat_name:""
      },
      // 验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      },
      cat_id:0,
      cat_name:""
    };
  },
  created() {this.getGoodsList();},
  mounted() {
    
  },
  methods: {
    //   获取所有数据的列表
    async getGoodsList() {
      const {data: res} = await this.$axios.get("categories",{
         params: this.cateList }
      );
      // console.log(res.data);
      
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }

      console.log(res.data)
      this.$message.success(res.meta.msg);
      // 把数据列表，赋值给 catelist
      this.goodsList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },

    //点击添加分类的对话框显示
    showCateForm() {
      // 调用获取父级分类的ID函数
      this.getPanterId();
      //   展示对话框
      this.cateShow = true;
    },
    // 获取父级分类的ID
    getPanterId() {
      this.$axios
        .get("categories", {
          params: { type: 2 }
        })
        .then(res => {
          console.log(res.data.data);
          if (res.data.meta.status == 200) {
            this.$message.success("获取父类分配ID成功");

            this.parentList = res.data.data;
          } else {
            this.$message.error("获取父类分类ID失败");
          }
        });
    },
    // 选择项发生变化就会执行这个函数
    panterChange() {
      console.log(this.selectKeys);
      // 如果selectKeys数组的长度大于0证明选中了父级分类
      // 反之证明没选中
      if (this.selectKeys.length > 0) {
        // 父级分类的ID
        // cat_pid: 0,
          (this.addCateForm.cat_pid = this.selectKeys[
            this.selectKeys.length - 1
          ]);

        this.addCateForm.cat_level = this.selectKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;

        this.addCateForm.cat_level = 0;
      }
    },
    addCrte() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return;
        this.$axios
          .post(
            "categories",
            this.addCateForm
          )
          .then(res => {
            console.log(res);
            if (res.data.meta.status == 201) {
            this.$message.success(res.data.meta.msg);
            this.getGoodsList();
            this.cateShow = false
           
          } else {
            this.$message.error(res.data.meta.msg);
          }
          });
      });
    },
async del(id){
  console.log(id.cat_id)
      const {data:res} = await this.$axios.delete(`categories/${id.cat_id}`)
      console.log(res)
      if(res.meta.status !==200) return this.$message.error("删除失败")
        this.$message.success('删除成功')
        this.getGoodsList();
},
bianji(res){
  console.log(res)
this.changeRoles = res;
this.cat_id=res.cat_id
this.cat_name=res.cat_name
this.show=true
},

async bj(){
const {data:res}=await this.$axios.put(`categories/${this.changeRoles.cat_id}`,
this.changeRoles)
console.log(res)
if(res.meta.status !==200) return this.$message.error('失败了呢')
this.$message.success('恭喜您修改成功~')
this.show=false
this.getGoodsList();
},

    // 监听对话框关闭事件
    addCrteClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },

    // 分页数据
    handleSizeChange(size) {
      console.log(size);
      this.cateList.pagesize = size;
       this.getGoodsList();
    },
    handleCurrentChange(page) {
      console.log(page);
      this.cateList.pagenum = page;
       this.getGoodsList();
    }
  },
  computed: {},
  components: {}
};
</script>

<style scoped>
</style>

