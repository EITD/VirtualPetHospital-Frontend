
<template>
  <div class='body' id="particles-js">
    <slot />
  </div>
</template>


<script>
export default {
  name: 'particles'
}
</script>


<script setup>
import { defineComponent, reactive,ref,onMounted,getCurrentInstance,watch } from 'vue';
import particlesJs from "./particles.js";
import particlesConfig from "./particles.json";

onMounted(()=>{
  init()
})

const init = () => {
  particlesJS("particles-js", particlesConfig);
  document.body.style.overflow = "hidden";
}

</script>

<style  lang='less' scoped>
@import "@/assets/styles/login.less";
#particles-js {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("/img/bg.jpg");
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  margin-left: auto;
  margin-right: auto;
}
</style>