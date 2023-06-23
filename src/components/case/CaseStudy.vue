<template>
  <div class="container">
    <HeaderBar :name="title"/>
    <div class="content">
      <a-menu style="width: 256px; height: 100%;" mode="inline">
          <a-menu-item v-for="item in menu" :key="item" @click="chooseCase(item)">
            <span class="menuItem">{{ item.type }}</span>
          </a-menu-item>
      </a-menu>
      <div class="right">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="6" v-for="item in cases" @click="caseDetail(item)">
            <div class="gutter-box">{{item}}</div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CaseStudy"
}
</script>

<script setup>
import HeaderBar from '@/components/common-comps/header-bar.vue';
import {onMounted, reactive, ref} from 'vue';
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const title = "病例学习";

onMounted(() => {
  getMenuData()
})
const menu = ref([])
  //   ref([{type: "寄生虫病", cases: ["蛔虫病", "钩虫病", "绦虫病", "球虫病", "疥螨虫病", "蚤病"]},
  // {type: "内科病例", cases: ["口炎", "肠炎", "肠便秘"]}])
const cases = ref([])

const getMenuData = async () => {
  axios.get('http://121.41.117.97:3000/caseType').then((res) => {
    menu.value = res.data;
  })
}
const chooseCase = (item) => {
  cases.value = item.cases;
}
const caseDetail = (item) => {
  router.push({
    name: 'CaseDetail',params: {item}
  })
}
</script>

<style lang="less" scoped>
.container {
  overflow: scroll;
  background: url("../../assets/background1.jpg");
  width: 100%;
  height: 100%;
}
.content {
  display: flex;
  margin: 20px 50px;
  background: rgba(255, 255, 255, 0.5);
  height: 100%;
}
.menuItem {
  color: #5b89c7;
  font-weight: bold;
}
.right {
  width: 100%;
  padding: 10px;
}
.gutter-box {
  background: white;
  border: 2px solid #c0dbec;
  border-radius: 5px;
  box-shadow: 0px 0px 2px #c0dbec;
  padding: 10px;
  margin: 5px;
  text-align: center;
  color: #5b89c7;
  font-weight: bold;
}
</style>