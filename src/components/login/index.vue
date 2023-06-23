
<template>
  <!-- <particles> -->
    <div class="all">
      <div class="login" id="login">
        <div class="login">
          <h2>虚拟宠物医院</h2>
          <div class="login_box">
            <input @input="userInfo.username=$event.target.value" :value="userInfo.username" @blur="checkName"
              @change="showNameTip=false;showNameTip2=false" required />
            <label>用户名 <span class='tip' v-if="showNameTip">*请输入用户名</span><span class='tip' v-if="showNameTip2">长度在 3 到 10 个字符</span></label>
          </div> 
          <div class="login_box">
            <input @input="userInfo.password=$event.target.value" type="password" :value="userInfo.password" @blur="checkPassword"
              @change="showPasswordTip=false;showPasswordTip2=false" required />
            <label>密码 <span class='tip' v-if="showPasswordTip">*请输入密码</span><span class='tip' v-if="showPasswordTip2">长度在 3 到 20 个字符</span></label>
          </div>
          <a-button @click="login">登录</a-button>
        </div>
      </div>

    </div>
    <!-- <div class="rotating-plane " id="shape"></div> -->
  <!-- </particles> -->

</template>

<script>
export default {
  name: 'Login'
}
</script>

<script setup >
import particles from '@/components/particles/index.vue'
import { defineComponent, reactive, ref, onMounted, getCurrentInstance, watch } from 'vue';
import { useReq } from '@/components/common/use-req.js'
import { useRouter } from 'vue-router'
// import { getConfigs } from '@/components/common/get-user-info'
const { proxy } = getCurrentInstance()
const { handleReqAct } = useReq()
const router = useRouter()
const showNameTip = ref(false)
const showNameTip2 = ref(false)
const showPasswordTip = ref(false)
const showPasswordTip2 = ref(false)
const userInfo = reactive({
  username: '',
  password: ''
})


const login = async () => {
  if (!showNameTip.value && !showPasswordTip.value && !showNameTip2.value && !showPasswordTip2.value) {
    proxy.request.post("/user/login", userInfo).then(res => {
      if(res.code === '200') {
        // localStorage.setItem("user", JSON.stringify(res.data))
        localStorage.setItem("token", JSON.stringify(res.data.token))
        proxy.$message.success("登录成功")
        console.log(res.data)
        router.push({
          name: 'Home'
        })
      } else {
        proxy.$message.error(res.msg)
      }
    })
  } else {
    //不能为空姓名
  }
}

const checkName = () => {
  if (!userInfo.username) {
    showNameTip.value = true
  } else {
    showNameTip.value = false
     if (userInfo.username.length<3 || userInfo.username.length>10) {
        showNameTip2.value = true
      } else {
        showNameTip2.value = false
      }
  }
}

const checkPassword = () => {
  if (!userInfo.password) {
    showPasswordTip.value = true
  } else {
    showPasswordTip.value = false
      if (userInfo.password.length<3 || userInfo.password.length>20) {
        showPasswordTip2.value = true
      } else {
        showPasswordTip2.value = false
      }
  }
}
</script>


<style lang='less' scoped>
@import "@/assets/styles/login.less";
.tip {
  float: right;
  color: red;
}
.all{
  background: url("/img/home.png");
  width: 100%;
  height:100%

}
</style>
