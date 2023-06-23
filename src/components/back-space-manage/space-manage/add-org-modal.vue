<template>
    <a-modal :visible="true" title="添加组织" width="1000px" :footer="null" @cancel="handleCancel" centered> 
        <div class="container">
            <div class="description">
                <span>空间名称：</span>
                <span v-text="name"></span>
            </div>
            <div class="body">
                <div class="searchForm" style='display: flex; justify-content:flex-start'>
                    <a-form
                    :model="orgSearchForm"
                    autocomplete="off"
                    layout="inline"
                    >
                        <a-form-item label="组织超级管理员手机号" name="orgSuperAdminMobile" style="margin: 10px 20px">
                            <a-input v-model:value="orgSearchForm.orgSuperAdminMobile"></a-input>
                        </a-form-item>
                        <a-form-item label="组织名称" name="orgName" style="margin: 10px 20px">
                            <a-input v-model:value="orgSearchForm.orgName"></a-input>
                        </a-form-item>
                        <a-form-item>
                            <a-button
                            type="primary"
                            html-type="submit"
                            style="margin: 10px 10px 10px 30px"
                            @click="pagination.pageNum = 1;search()"
                            >查询</a-button
                            >
                            <a-button style="margin: 10px" @click="resetFields">重置</a-button>
                        </a-form-item>
                    </a-form>
                </div>
                <div class="orgTable">
                    <a-table
                        class="ant-table-body"
                        :columns="columns"
                        :data-source="data.list"
                        :pagination="false"
                        :row-selection="{onChange: onSelectChange, type: 'radio' }"
                        :scroll="{ x: 800, y: 300 }"
                        :rowKey='record=>record._id'
                        bordered>
                    </a-table>
                </div>
                <div class="footer">
                  <a-pagination class='pages' v-model:current="pagination.pageNum" v-model:page-size="pagination.pageSize"
                    :total="pagination.total" 
                      @change="pageChange" show-less-items/>
                </div>
                <div>
                    <a-button style="float:right" type="primary" html-type="submit" @click="handleOk">添加</a-button>
                    <a-button style="margin-right: 10px;float:right" @click="handleCancel">取消</a-button>
                </div>  
            </div>
        </div>
    </a-modal>
</template>


<script setup>
import { validateSearch } from "ant-design-vue/lib/vc-mentions/src/util";
import { UploadOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref, toRefs, toRaw, onMounted, getCurrentInstance } from "vue";
import { message } from 'ant-design-vue';
import { Form } from 'ant-design-vue';
import { useReq } from "@/components/common/use-req.js";
import lodash from 'lodash'
const { proxy } = getCurrentInstance();
const { handleReqAct } = useReq();
const useForm = Form.useForm;
const emit = defineEmits(['changeState'])
const props = defineProps({
    name: {required: true, type: String, default: {} },
    spaceId: {required: true, type: String, default: {} },
});
const orgSearchForm = reactive({
    orgSuperAdminMobile: '',
    orgName: ''
});
const addForm = reactive({
    orgIds: [],
    spaceId: props.spaceId
})
const { resetFields } = Form.useForm(orgSearchForm);

onMounted(() => {
    // getOrgData();
});
const search = () => {
    getOrgData();
};
const handleOk = async()=> {
  if(addForm.orgIds.length){
    let res = await handleReqAct({
    name: 'addOrg',
    datas: {
      orgIds: Object.values(addForm.orgIds),
      spaceId: addForm.spaceId
    }
    });
    if (res.success) {
      proxy.$message.success('添加成功')
      emit('changeState',false);
      getOrgData();
    } else {
      if(res.result.errorCode == '10075'){
      proxy.$message.error('组织已关联专属空间')
      }
    }
  }
  else{
  }
};
const handleCancel = ()=> {
    emit('changeState',false)
};
const data = reactive({
  list: [],
  totalCount: 0,
});
const columns = [{
  title: '组织名称',
  width: 100,
  dataIndex: 'name',
  key: 'name',
}, {
  title: '组织ID',
  width: 100,
  dataIndex: '_id',
  key: '_id',
}, {
  title: '组织超级管理员手机号',
  dataIndex: 'mobile',
  key: 'mobile',
  width: 150,
}, {
  title: '组织超级管理员姓名',
  dataIndex: 'superAdmin',
  key: 'superAdmin',
  width: 150,
}];
const pagination = reactive({
  total: undefined,
  pageNum: 1,
  pageSize: 20,
  // showSizeChanger: false,
  // // hideOnSinglePage:true,//只有一页时是否隐藏分页器
  // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`, //分页中显示总的数据
  // onChange: (current) => {
  //   pagination.pageNum = current;
  //   getOrgData();
  // },
});
const pageChange = (number) => {
  pagination.pageNum = number
  getOrgData()
}
const getOrgData = async() => {
    let res = await handleReqAct({
    name: 'getAllOrg',
    datas: {
      superAdminPhone: orgSearchForm.orgSuperAdminMobile,
      organizationName: orgSearchForm.orgName,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    }
    });
    if (res.success) {
      data.list = res.result.data;
      pagination.total = res.result.totalCount;
    } else{

      // console.log(res);
    }
};
const selectedRow = ref([]);  //单选表格
const onSelectChange = (selectedRowKeys, selectedRows) => {
    addForm.orgIds=selectedRowKeys
};
</script>
<style lang="less" scoped>
.description{
    margin-left: 26px;
}
.body {
  margin-top: 15px;
  border-top: 3px solid #e4e4e7;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .footer{
    height: inherit;
    width: 100%;
    display: flex;
    margin-top: 10px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: right;
  }

}
</style>
