<template>
    <div class="container">
      <HeaderBar :name="title"/>
      <div class="content">
        <a-steps v-model:current="current" >
          <a-step title="接诊" @click="getCase(1)"/>
          <a-step title="检查" @click="getCase(2)"/>
          <a-step title="诊断" @click="getCase(3)"/>
          <a-step title="治疗" @click="getCase(4)"/>
        </a-steps>
        <div class="down">
          <div class="subtitle">描述</div>
          <div class="divider"></div>
          <div class="text">{{text}}</div>
          <div class="subtitle" v-if="showImage">图片资料</div>
          <div class="divider" v-if="showImage"></div>
          <div class="row">
            <img v-for="imgUrl in images" :src="imgUrl">
          </div>
          <div class="subtitle" v-if="showVideo">视频资料</div>
          <div class="divider" v-if="showVideo"></div>
          <div class="center">
            <video v-for="videoUrl in videos" :src="videoUrl" controls></video>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "CaseDetail"
}
</script>

<script setup>
import HeaderBar from '@/components/common-comps/header-bar.vue';
import { useRoute } from "vue-router";
import {reactive, ref, onMounted} from 'vue';
import axios from "axios";

const route = useRoute();
const title = route.params.item;
const text = ref("")
const images = ref([])
const videos = ref([])
const showImage = ref(false)
const showVideo = ref(false)

onMounted(() => {
  axios.get('http://121.41.117.97:3000/case?name=' + title + '&entry=' + 1).then((res) => {
    text.value = res.data.text;
    for(const item of res.data.src) {
      if(item.includes(".mp4")) {
        videos.value.push(item);
        showVideo.value = true;
      }
      else {
        images.value.push(item);
        showImage.value = true;
      }
    }
  })
})

const getCase = async (entry) => {
  images.value = []
  videos.value = []
  showImage.value = false;
  showVideo.value = false;
  axios.get('http://121.41.117.97:3000/case?name=' + title + '&entry=' + entry).then((res) => {
    text.value = res.data.text;
    for(const item of res.data.src) {
      if(item.includes(".mp4")) {
        videos.value.push(item);
        showVideo.value = true;
      }
      else {
        images.value.push(item);
        showImage.value = true;
      }
    }
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
  flex-direction: column;
  margin: 20px 50px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  min-height: 100%;
}
.down {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.subtitle {
  color: #5b89c7;
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
}
.divider {
  height: 1px;
  background-color: #5b89c7;
  margin-top: 10px;
}
.text {
  text-indent:2em;
  margin-top: 10px;
}
.row {
  display: flex;
  flex-wrap: wrap;
}
.center {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
img {
  width: 250px;
  margin-top: 10px;
  margin-left: 20px;
  border: 3px solid #5b89c7;
}
video {
  height: 400px;
  margin-top: 20px;
  margin-left: 20px;
}
</style>