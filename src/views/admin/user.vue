<template>
  <div>
    <el-card>
      <div style="margin-top: 15px">

        <el-input
          style="width: 40%"
          placeholder="请输入内容"
          v-model="Info.query"
          class="input-with-select"
          @keydown.enter.native="list">

          <el-button slot="prepend" type="primary" @click="tj = true">添加用户</el-button>
<!-- 搜索 -->
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="list"
          ></el-button>
        </el-input>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="State(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">

            <el-tooltip
              effect="dark"
              content="修改用户"
              placement="top"
              :enterable="false">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row)"></el-button>
            </el-tooltip>


              <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scope.row.id)"></el-button>
           </el-tooltip>


            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"></el-button>
            </el-tooltip>
            
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Info.pagenum"
          :page-sizes="[1, 3, 5, 10]"
          :page-size="Info.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="tj" width="50%" @close="add">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" ref="ref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="tj = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <div>
      <el-dialog title="添加用户" :visible.sync="editUserShow">
        <el-form>
          <el-form-item title="用户名" label-width="80px">
            <el-input
              v-model="editUser.username"
              placeholder="输入用户名"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item title="邮箱" label-width="80px">
            <el-input
              v-model="editUser.email"
              placeholder="输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item title="电话" label-width="80px">
            <el-input
              v-model="editUser.mobile"
              placeholder="输入电话"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-button @click="editUserShow = false">取消</el-button>
          <el-button type="primary" @click="saveUser">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      Info: {
        query: "",
        pagenum: 1,
        pagesize: 3,
      },
      total: 0,
      tj: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editUserShow: false,
      editUser: {
        username: "",
        email: "",
        mobile: "",
      },
    };
  },
  mounted() {
    //调用基础数据
    this.list();
  },
  methods: {
    // 用户列表获取
    async list() {
      const { data: res } = await this.$axios.get("users", {
        params: this.Info,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.tableData = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },

// 添加
    add() {
      this.$refs.ref.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("users", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("创建失败");
        this.$message.success("创建成功");
        this.add = false;
        this.list();
      });
    },
  
// 更改状态
    async State(state) {
      const { data: res } = await this.$axios.put(
        `users/${state.id}/state/${state.mg_state}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        zt.mg_state = !zt.mg_state;
        return this.$message.error("更新用户状态失败！！！");}
      this.$message.success("更新状态成功");
    },

    //修改
    edit(xg) {
      console.log(xg);
      // 把获取到的数据，直接给edit
      this.editUser = xg;
      // 控制表单显示
      this.editUserShow = true;
    },
    async saveUser() {
      if (this.editUser.email == "" || this.editUser.mobile == "")
        return this.$message.error("邮箱和密码不能为空");
      const { data: res } = await this.$axios.put(
        `users/${this.editUser.id}`,
        this.editUser
      );
      if (res.meta.status !== 200) return this.$message.error("修改失败");
      this.$message.success("修改成功");
      this.editUserShow = false;
      this.list();
    },

//删除
    async del(id) {
      console.log(id);
      const { data: res } = await this.$axios.delete(`users/${id}`);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.list();
    },
    

    //监听添加用户对话框的关闭事件
    add() {
      this.$refs.ref.resetFields();
    },

      handleSizeChange(val) {
      this.Info.pagesize = val;
      this.list();
     },

    handleCurrentChange(val) {
      this.Info.pagenum = val;
      this.list();
     },
  },

};
</script>

<style scoped>
.el-input {
  width: 30%;
}
</style>
