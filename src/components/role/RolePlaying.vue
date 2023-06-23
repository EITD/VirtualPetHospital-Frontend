<template>
  <div class="container">
    <HeaderBar :name="title"/>
    <div class="choose">请 选 择 您 要 扮 演 的 角 色</div>
    <div class="mode">
      <div class="item" @click='play("前台")'>
        <img src="../../assets/frontdesk.png" style="width: 130px; "/>
        <div class="text">前台</div>
      </div>
      <div class="item" @click='play("医助")'>
        <img src="../../assets/assistant.png" style="width: 130px;"/>
        <div class="text">医助</div>
      </div>
      <div class="item" @click='play("兽医师")'>
        <img src="../../assets/doctor.png" style="width: 130px;"/>
        <div class="text">兽医师</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RolePlaying"
}
</script>

<script setup>
import HeaderBar from '@/components/common-comps/header-bar.vue';
import { useRouter } from "vue-router";

const router = useRouter();
const title = "角色扮演";

const play = (role) => {
  router.push({
    name: 'RoleLearning', params: {role}
  })
}
</script>

<style lang="less" scoped>
.container {
  background: url("../../assets/background1.jpg");
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
  height: 200px;
  display: flex;
  margin-top: 20px;
  margin-left: 30px;
}
.item {
  background: rgba(255, 255, 255, 0.5);
  margin-left: 20px;
  padding: 10px;
}
.text {
  margin-top: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
</style>