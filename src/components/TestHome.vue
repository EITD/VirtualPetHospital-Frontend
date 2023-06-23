<template>
  <div class="container">
    <HeaderBar :name="title"/>
    <div class="mode">
 <div v-for="t in tcc" :key="t" class="item" 
     :class="{disabled: !isTimeInRange(t.startTime, t.endTime)}"
     @click="isTimeInRange(t.startTime, t.endTime) && examCard(t.paperId)">
  <div class="img-container">
    <div class="img-wrapper">
      <img :src=caseImage
     :style="{filter: !isTimeInRange(t.startTime, t.endTime) ? (early(t.startTime)?'grayscale(50%)' :'grayscale(100%)' ): 'none', width: '200px'}"/>

      <div v-if="!isTimeInRange(t.startTime, t.endTime)&&early(t.startTime)" class="tip" align="center">
        {{'考试未开始'}}
      </div>
      <div v-else-if="!isTimeInRange(t.startTime, t.endTime)" class="tip" align="center">
        {{'考试已结束'}}
      </div>
    </div>
  </div>
  <div class="text">{{t.name}}</div>
 
</div>


      
    </div>
  </div>
</template>

<script>
import caseImage from '../assets/case.png';
export default {
  name: "TestHome",
  methods: {
   
    isTimeInRange(startTime, endTime) {
      const now = Date.now();
      return now >= new Date(startTime).getTime() && now <= new Date(endTime).getTime();
    },
    early(startTime){
      const now = Date.now();
      return now < new Date(startTime).getTime();
    }
  }
}

</script>

<script setup>
import HeaderBar from '@/components/common-comps/header-bar.vue';
import {onMounted, reactive, ref} from 'vue';
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const title = "我的考试";

const role = () => {
  router.push({
    name: 'RolePlaying'
  });
}
const examCard = (t) => {
  router.push({
    name: 'ExamCard',params:{id:t}
  });
}
const tcc = ref([])
onMounted(() => {
  getTestCanData();
})
var tests=[];
const testscan=[];
var usercant=[];

const getTestCanData = async () =>{
  await axios.get('http://localhost:8000/test/').then( (response)=> {
    tests=JSON.parse(JSON.stringify(response.data)).data;console.log(tests);
  })
  for(let i in tests)await axios.get("http://localhost:8000/user/t_u/"+tests[i].id).then((response)=> {
    console.log(tests[i]);
    usercant=response.data.data;console.log(usercant);
    var f=0;
    for(let j in usercant)if(usercant[j].id==JSON.parse(localStorage.getItem("user")).id){f=1;console.log(usercant[j].id);}
    if(f==0)testscan.push(tests[i]);
    console.log(testscan)
  });
  tcc.value=testscan;
}



</script>

<style lang="less" scoped>
.img-container {
  position: relative;
}

.img-wrapper {
  position: relative;
}

.tip {
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  font-size: 20px;
  color: #333;
  border-radius: 5px;
}
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
  margin-left: 30px;
}
.text {
  margin-top: 5px;
  text-align: center;
  font-size: 15px;
}
</style>