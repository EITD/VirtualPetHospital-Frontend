<template>
  <div class="header">
    <div class="left">
      <div class="title">虚拟宠物医院学习软件</div>
      <div class="subtitle">{{props.name}}</div>
    </div>
    <div>
      <a-button @click="back" ghost shape="round" type="primary" style="margin-right: 10px">返回上级</a-button>
      <a-button ghost shape="round" type="primary" @click="logout">退出系统</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "header-bar"
}
</script>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  name: {required: true, type: String, default: {} }
});

const back = () => {
  router.back()
}
const logout = () => {
    localStorage.removeItem('token')
    router.push({ name: 'Login' })
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}
.left {
  display: flex;
  align-items: baseline;
}
.title {
  font-size: 30px;
  color: white;
  text-shadow: 1px 1px 1px
}
.subtitle {
  font-size: 20px;
  color: white;
  margin-left: 10px;
  text-shadow: 1px 1px 1px #666;
}
</style>