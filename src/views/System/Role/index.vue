<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item, index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{ active: activeIndex === index }"
        @click="roleClickFn(index, item.roleId)"
      >
        <div class="role-info">
          <svg-icon icon-class="user" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editRole(item.roleId)"
                >编辑角色</el-dropdown-item
              >
              <el-dropdown-item @click.native="delRole(item.roleId)"
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/add-role')"
        >添加角色</el-button
      >
    </div>
    <!-- 右侧权限和成员 -->
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="tree">
          <div class="tree-wrapper">
            <!-- 分为五列功能权限点 -->
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                :data="item.children"
                :props="{
                  label: 'title',
                  children: 'children',
                  disabled: 'flag',
                }"
                show-checkbox
                default-expand-all
                check-strictly
                check-on-click-node
                :expand-on-click-node="false"
                node-key="id"
                ref="myTree"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员${roleUserTotal}`" name="member">
          <div class="user-wrapper">
            <el-table :data="roleUserList">
              <el-table-column type="index" width="250" label="序号" />
              <el-table-column prop="name" label="员工姓名" />
              <el-table-column prop="userName" label="登录账号" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getRoleListAPI,
  getTreeListAPI,
  getRoleDetailAPI,
  getRoleUserAPI,
  delRoleUserAPI,
} from "@/apis/system";

export default {
  name: "Role",
  data() {
    return {
      roleList: [],
      activeIndex: 0, // 高亮索引
      treeList: [], // 权限点列表
      roleDetailList: [], // 权限点id集合
      activeName: "tree",
      roleUserList: [], // 成员列表
      roleUserTotal: 0, // 成员总数
    };
  },
  async created() {
    await this.getList();
    await this.getTreeList();
    this.getRoleDetailListFn(this.roleList[0].roleId);
    this.getMemberListFn(this.roleList[0].roleId);
  },
  methods: {
    // 获取角色列表
    async getList() {
      const res = await getRoleListAPI();
      this.roleList = res.data;
    },
    // 点击某项
    roleClickFn(index, roleId) {
      this.activeIndex = index;
      this.getRoleDetailListFn(roleId);
      this.getMemberListFn(roleId);
    },
    // 请求所有功能权限点列表
    async getTreeList() {
      const res = await getTreeListAPI();
      // 遍历层数不确定 -> 递归
      res.data.forEach((ele) => {
        this.setFlagFn(ele);
      });
      this.treeList = res.data;
    },
    // 设置 flag 函数
    setFlagFn(ele) {
      ele.flag = true;
      if (ele.children) {
        // 有子树
        ele.children.forEach((childEle) => {
          this.setFlagFn(childEle);
        });
      }
    },
    // 请求权限列表
    async getRoleDetailListFn(roleId) {
      const roleRes = await getRoleDetailAPI(roleId);
      this.roleDetailList = roleRes.data.perms;
      this.$refs.myTree.forEach((ele, index) => {
        ele.setCheckedKeys(this.roleDetailList[index]);
      });
    },
    // 请求指成员列表
    async getMemberListFn(roleId) {
      const res = await getRoleUserAPI(roleId);
      this.roleUserList = res.data.rows;
      this.roleUserTotal = res.data.total;
    },
    // 删除角色
    async delRole(roleId) {
      await delRoleUserAPI(roleId);
      this.getList();
    },
    // 编辑角色
    editRole(roleId) {
      this.$router.push(`/add-role?roleId=${roleId}`);
    },
  },
};
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper {
      padding: 20px;
    }
  }
}
</style>
