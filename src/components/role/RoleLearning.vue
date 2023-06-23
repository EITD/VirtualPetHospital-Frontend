<template>
  <div class="container">
    <HeaderBar :name="title"/>
    <div class="content">
      <a-menu style="width: 256px;" mode="inline">
        <a-sub-menu v-for="item in menu">
          <template #title>{{ item.type }}</template>
          <a-menu-item v-for="work in item.works" :key="work" @click="chooseWork(work)">{{ work }}</a-menu-item>
        </a-sub-menu>
      </a-menu>
      <div class="right">
        <div class="up">
          <div class="title">{{name}}</div>
          <img v-if="imageUrl" :src="imageUrl" class="image"/>
          <video v-if="videoUrl" :src="videoUrl" controls class="video"></video>
        </div>
        <div class="data">{{data}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoleLearning"
}
</script>

<script setup>
import HeaderBar from '@/components/common-comps/header-bar.vue';
import {onMounted, reactive, ref} from 'vue';
import { useRoute } from "vue-router";
import axios from 'axios';

const route = useRoute();
const title = route.params.role;

onMounted(() => {
  getMenuData()
})
const menu = ref([])
const name = ref("")
const data = ref("")
const imageUrl = ref("")
const videoUrl = ref("")

const getMenuData = async () => {
  if(title === "医助")
    axios.get('http://121.41.117.97:3000/assistantWorkType').then((res) => {
      menu.value = res.data;
    })
  else if(title === "兽医师")
    axios.get('http://121.41.117.97:3000/doctorWorkType').then((res) => {
      menu.value = res.data;
    })
  else
    axios.get('http://121.41.117.97:3000/frontdeskWorkType').then((res) => {
      menu.value = res.data;
    })
}
const chooseWork = async (work) => {
  imageUrl.value = "";
  videoUrl.value = "";
  if(title === "医助")
    axios.get('http://121.41.117.97:3000/assistantWork?name=' + work).then((res) => {
      name.value = work;
      data.value = res.data.description;
      if(res.data.src.includes(".mp4"))
        videoUrl.value = res.data.src;
      else
        imageUrl.value = res.data.src;
    })
  else if(title === "兽医师")
    axios.get('http://121.41.117.97:3000/doctorWork?name=' + work).then((res) => {
      name.value = work;
      data.value = res.data.description;
      if(res.data.src.includes(".mp4"))
        videoUrl.value = res.data.src;
      else
        imageUrl.value = res.data.src;
    })
  else
    axios.get('http://121.41.117.97:3000/frontdeskWork?name=' + work).then((res) => {
      name.value = work;
      data.value = res.data.description;
      if(res.data.src.includes(".mp4"))
        videoUrl.value = res.data.src;
      else
        imageUrl.value = res.data.src;
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
  background: rgba(255, 255, 255, 0.8);
  height: fit-content;
  min-height: 100%;
}
.right {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.up {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
}
.image {
  width: 400px;
  margin-bottom: 20px;
  border: 5px solid white;
}
.video {
  height: 400px;
  margin-bottom: 40px;
}
.data {
  white-space: pre-wrap;
}
</style>