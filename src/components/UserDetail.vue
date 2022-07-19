<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>用户详情</span>
      <el-button
        style="float: right; padding: 3px 0"
        type="text"
        @click="goBack"
        >返回</el-button
      >
    </div>
    <div class="text item">
      <p>姓名：{{ userInfo.name }}</p>
      <p>年龄：{{ userInfo.age }}</p>
      <p>头衔：{{ userInfo.position }}</p>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "UserDetail",
  props: ["id"], // 通过路由的props传参方式获取
  data() {
    return {
      userInfo: {},
    };
  },
  created() {
    // 发起获取详情信息
    this.getUserInfo();
  },
  methods: {
    // 定义获取详情的请求
    async getUserInfo() {
      // this.$http.get('/api/users/:id')
      const { data: res } = await this.$http.get("/api/users/" + this.id);
      // console.log(res); // 能够看到详情信息
      if (res.status !== 0) return this.$message.erro("获取用户详情数据失败");
      this.userInfo = res.data;
    },

    // 返回按钮
    goBack() {
      // this.$router.back();  // 这个方法可以
      this.$router.go(-1); // 这个方法也可以
    },
  },
};
</script>

<style scoped>
</style>