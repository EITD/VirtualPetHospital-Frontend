<template>
  <div class="userinfo">
    <a-tooltip placement="bottomRight" trigger="hover">
      <template #title>
        <ul class="toolTipUl">
          <li>
            <a @click="logout">
              <LogoutOutlined class="mr4" />{{$t('txt.logout')}}
            </a>
          </li>
        </ul>
      </template>
      <div class="userinfoPlat">
        <UserOutlined class="mr4" />
        <span>Admin</span>
      </div>
    </a-tooltip>
  </div>
</template>

<script setup>
import { UserOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useReq } from '@/components/common/use-req.js'
const { handleReqAct } = useReq()
const router = useRouter();
const logout = async () => {
  // let res = await handleReqAct({ name: 'loginOut' })
  // if (res.success) {
    localStorage.removeItem('token')
    router.push({ name: 'Login' })
  // } else {

  // }
}
</script>

<style lang="less" scoped>
@import "@/assets/styles/common.less";
.userinfoPlat {
  cursor: pointer;
  font-size: 1.1rem;
  .flexRowEndCenter();
}
</style>