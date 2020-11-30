<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login/user' }"
        >用户首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片表格区域 -->
    <el-card shadow="always">
      <el-button type="primary" @click="dialogFormVisible = true"
        >添加角色</el-button
      >
      <el-table :data="rolesList" style="width: 100%">
        <el-table-column type="expand" width="180">
          <template slot-scope="scope">
            <!-- 存放权限 -->
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'con']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  size="medium"
                  closable
                  @close="remove(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right" @click="td(scope)"></i>
              </el-col>
              <!-- 二级权限,三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'con']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
    
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      size="medium"
                      type="success"
                      closable
                      @close="remove(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="13">
                    <el-tag
                      size="medium"
                      type="warning"
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="remove(scope.row, item3.id,index3)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="300"
        ></el-table-column>
        <el-table-column prop="email" label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="changeroles(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
      <el-form :model="addRolesList" :rules="loginRules">
        <el-form-item label="姓名名称" :label-width="'80px'" prop="roleName">
          <el-input
            v-model="addRolesList.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="'80px'" prop="roleDesc">
          <el-input
            v-model="addRolesList.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrolesList">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="show">
      <el-form :model="changeRoles" :rules="loginRules">
        <el-form-item label="角色名称" :label-width="'80px'" prop="roleName">
          <el-input
            v-model="changeRoles.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色职位" :label-width="'80px'" prop="roleDesc">
          <el-input
            v-model="changeRoles.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="changeRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightslist: [],
      // 角色的数据列表
      rolesList: [],
      //   添加角色的数据
      setRightDialogVisible: false,
      addRolesList: {
        roleName: "",
        roleDesc: "",
      },
      defKeys: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      dialogFormVisible: false,
      loginRules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入职位", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      //   修改角色
      changeRoles: {
        roleName: "",
        roleDesc: "",
      },
      show: false,
      cid: 0,
    };
  },
  created() {},
  mounted() {
    this.getRolesList();
  },
  methods: {
    //   角色列表的数据
    async getRolesList() {
      const { data: res } = await this.$axios.get(
        `https://www.liulongbin.top:8888/api/private/v1/roles`
      );
      console.log(res);
      if (res.meta.status == 200) {
        this.$message.success(res.meta.msg);
        this.rolesList = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    // 添加角色
    async addrolesList() {
      const { data: res } = await this.$axios.post(
        "https://www.liulongbin.top:8888/api/private/v1/roles",
        this.addRolesList
      );
      console.log(res);
      if (res.meta.status == 201) {
        this.$message.success(res.meta.msg);
        this.dialogFormVisible = false;
        this.getRolesList();
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    // 删除角色
    del(id) {
      console.log(id);
      this.$confirm("你是不是真的要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .delete(`https://www.liulongbin.top:8888/api/private/v1/roles/` + id)
          .then((res) => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success(res.data.meta.msg);
              this.getRolesList();
            } else {
              this.$message.error(res.data.meta.msg);
            }
          });
      });
    },
    // 编辑角色
    changeroles(row) {
      console.log(row);
      this.changeRoles = row;
      this.cid = row.id;
      this.show = true;
    },
    async changeRole() {
      const { data: res } = await this.$axios.put(
        `https://www.liulongbin.top:8888/api/private/v1/roles/` + this.cid,
        this.changeRoles
      );
      console.log(res);
      if (res.meta.status == 200) {
        this.$message.success(res.meta.msg);
        this.getRolesList();
        this.show = false;
      } else {
        this.$message.error(res.meta.msg);
      }
    },

    // 根据ID删除用户权限
    async remove(roleID, rightID,index) {
     
      const con = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (con !== "confirm") {
        return this.$message.info("取消了删除");
      }
//暂时哑火，不知道咋搞 嗯 有点像全选 但是又更麻烦好多啊
      // if (roleID.children[0].children[0].children.length == 1) {
      //   const { data: res } = await this.$axios.delete(
      //     `roles/${roleID.id}/rights/${roleID.children[0].id}`
      //   );
      // }

      const { data: res } = await this.$axios.delete(
        `roles/${roleID.id}/rights/${rightID}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除权限失败！");
      roleID.children = res.data;
    },
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$axios.get("rights/tree");

      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败！");
      }

      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data;
      console.log(this.rightslist);

      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys);

      this.setRightDialogVisible = true;
    },

    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      const idStr = keys.join(",");
console.log(idStr)
      const {
        data: res,
      } = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: idStr,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }

      this.$message.success("分配权限成功！");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
    setRightDialogClosed() {
      this.defKeys = [];
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
.con {
  display: flex;
  align-items: center;
}
</style>
