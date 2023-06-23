<template>
  <div class="container">
    <HeaderBar :name="title"/>
    <div class="choose">请 选 择 您 的 学 习 模 式</div>
    <div class="mode">
      <div class="item" @click="role">
        <img src="../assets/role.png" style="width: 200px;"/>
        <div class="text">角色扮演</div>
      </div>
      <div class="item" @click="caseStudy">
        <img src="../assets/case.png" style="width: 200px;"/>
        <div class="text">病例学习</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResponsibilityLearning"
}
</script>

<script setup>
import HeaderBar from '@/components/common-comps/header-bar.vue';
import { useRouter } from "vue-router";

const router = useRouter();
const title = "职能学习";

const role = () => {
  router.push({
    name: 'RolePlaying'
  });
}
const caseStudy = () => {
  router.push({
    name: 'CaseStudy'
  });
}
</script>

<style lang="less" scoped>
.container {
  background: url("../assets/background1.jpg");
  width: 100%;
  height: 100%;
}
.choose {
  font-size: 30px;
  color: white;
  text-shadow: 1px 1px 1px #666;
  margin-top: 100px;
  margin-left: 80px;
}
.mode {
  height: 250px;
  display: flex;
  margin-top: 20px;
  margin-left: 30px;
}
.item {
  background: rgba(255, 255, 255, 0.5);
  margin-left: 20px;
}
.text {
  margin-top: 5px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
</style>