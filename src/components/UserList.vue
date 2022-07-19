<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="dialogVisible = true"
      >添加新用户</el-button
    >

    <!-- 用户的表格 -->
    <el-table :data="userList" style="width: 100%" stripe border>
      <!-- 渲染用户名称这一列 -->
      <!-- 
        el-table：
          - prop="name" prop是把数据渲染到表格里，这个name是userList数组中，每一个对象里面的一个属性
          - stripe 隔行变色
          - type="index" 获得索引
       -->

      <el-table-column
        header-align="center"
        align="center"
        label="索引"
        type="index"
        width="70"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="name"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="age"
        label="年龄"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="position"
        label="头衔"
      >
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间">
        <!-- 
          table中自定义模板列：
            - 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据，用法参考 demo。
            - 使用了template+v-slot后就不用加当前列的prop了
         -->

        <!-- <template v-slot:default="scope"> -->
        <template #default="scope">
          <!-- 这个filter过滤器定义在全局的main.js中 -->
          {{ scope.row.addtime | dataFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <!-- v-slot的多种写法：这些写法都是vue3支持的 -->
        <!-- 写法一： <template v-slot:default="{ row }"> -->
        <!-- 写法二：<template #default="{ row }"> -->
        <!-- 写法三：<template v-slot="{ row }"> -->
        <template v-slot="{ row }">
          <!-- <a href="#">详情</a>&nbsp; -->
          <router-link :to="'/users/' + row.id">详情</router-link>&nbsp;
          <a href="#" @click.prevent="onRemove(row.id)">删除</a>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加用户的对话框 -->
    <!-- @close：Dialog 关闭的回调 -->
    <el-dialog
      title="添加新用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="onDialogClosed"
      ref="myaddForm"
    >
      <!-- 添加用户的表单 -->
      <el-form :model="form" :rules="formRules">
        <el-form-item label="用户姓名" label-width="80px" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="用户年龄" label-width="80px" prop="age">
          <el-input
            v-model.number="form.age"
            placeholder="请输入年龄"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户头衔" label-width="80px" prop="position">
          <el-input v-model="form.position" placeholder="请输入头衔"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddNewUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserList",
  data() {
    // 声明校验年龄的函数
    let checkAge = (rule, value, cb) => {
      if (!Number.isInteger(value)) {
        return cb(new Error("请填写整数"));
      }
      if (value > 100 || value < 1) {
        return cb(new Error("年龄必须在1-100之间"));
      }
      // 验证通过：直接调用cb();
      cb();
    };
    return {
      userList: [],
      // 控制添加对话框的显示和隐藏
      dialogVisible: false,
      // 要采集的用户的信息对象
      form: {
        name: "",
        age: "",
        position: "",
      },
      // 表单的验证规则对象
      formRules: {
        name: [
          { required: true, message: "姓名是必填项", trigger: "blur" },
          { min: 1, max: 15, message: "长度在3-10之间", trigger: "blur" },
        ],
        age: [
          { required: true, message: "年龄是必填项", trigger: "blur" },
          { validator: checkAge, trigger: "blur" },
        ],
        position: [
          { required: true, message: "头衔是必填项", trigger: "blur" },
          { min: 1, max: 10, message: "长度在3-10之间", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("/api/users");
      if (res.status !== 0) return console.log("用户列表数据获取失败");
      this.userList = res.data;
      // console.log(this.userList);
    },

    // 监听对话框，关闭的事件
    /* Form Methods: 
        - resetFields	对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
     */
    onDialogClosed() {
      // console.log("ok");
      // this.$refs.myaddForm.resetFields() // 错，不止为何
      this.form = {};
    },
    // 用户点击了添加按钮
    async onAddNewUser() {
      const { data: res } = await this.$http.post("/api/users", this.form);
      // console.log(res);
      if (res.status != 0) return this.$message.error("添加失败");
      this.dialogVisible = false;
      this.$message.success("添加成功");
      // 刷新列表数据
      this.getUserList();
    },

    // 点击了删除的链接
    async onRemove(id) {
      // 注意：this.$confirm返回的是一个promise对象，所以用await来接收
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err); // catch((err) => err): 防止报错
      // console.log(confirmResult); // 会得到 confirm 或者cancel

      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      /* console.log("row", row);
      this.userList = this.userList.filter((item) => row.id != item.id); */
      // 发起delete请求
      const { data: res } = await this.$http.delete("/api/users/" + id);
      if (res.status !== 0) return this.$message.err("删除失败");
      this.$message.success("删除成功");
      // 刷新列表数据
      this.getUserList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>