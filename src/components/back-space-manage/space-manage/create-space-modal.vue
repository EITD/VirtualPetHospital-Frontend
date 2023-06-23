<template>
    <a-modal :visible="true" :title="title" :footer="null" @cancel="handleCancel" :maskClosable="false" centered> 
      <a-form
        :model="applyForm"
        name="applyForm"
        :rules="rulesRef"
      >
        <a-form-item label="空间模板" v-bind="validateInfos.spaceTemplate" >
            <a-upload v-model:file-list="uploadFileList.jsonFile" :customRequest="upLoadJsonFile"  @change="handleChange">
                <a-button>
                <upload-outlined></upload-outlined>
                选择文件
                </a-button>
            </a-upload>
        </a-form-item>
        <a-form-item label="空间资源" v-bind="validateInfos.spaceResource">
            <a-upload v-model:file-list="uploadFileList.folder" :customRequest="upLoadFolder" :before-upload="beforeUpload" directory>
                <a-button>
                <upload-outlined></upload-outlined>
                选择文件夹
                </a-button>
            </a-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button style="float:right" type="primary"  @click="handleOk">保存</a-button>
            <a-button style="margin-right: 10px;float:right" @click="handleCancel">取消</a-button>
      </a-form-item>
      </a-form>
    </a-modal>
</template>

<script setup>
import { validateSearch } from "ant-design-vue/lib/vc-mentions/src/util";
import { UploadOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref, toRefs, toRaw, getCurrentInstance } from "vue";
import { message } from 'ant-design-vue';
import { Form ,Upload } from 'ant-design-vue';
import { useReq } from "@/components/common/use-req.js";
import { useUploadBySlice } from '@/utils/use-upload-by-slice.js';
import { useStore } from 'vuex'
const store = useStore()
let configInfo = store.getters['system/_getState']('configInfo')
const { handleReqAct } = useReq();
const { proxy } = getCurrentInstance()
const useForm = Form.useForm;
const applyForm = reactive({
  spaceType: '',
  spaceTemplate: '',
  spaceResource: '',
  remark: ''
});
const {uploadFile, handleClickCancelBtn} = useUploadBySlice();
const props = defineProps({
  title: {required: true, type: String, default: {} },
});
const uploadFileList = reactive({
  jsonFile: [],
  folder: [],
  folderList: [],
})
const emit = defineEmits(['changeState'])
const opt = {
    file: [],
    uploadEndpoint: configInfo.uploadUrl,
    path: configInfo.uploadPath,
    folderSize: 0
};
let valiFileUploaded =  (_rule) => {
      if(uploadFileList.jsonFile.length == 0){
        return Promise.reject('请选择json文件');
      }
      else{
        return Promise.resolve();
      }
};
let valiFolderUploaded =  (_rule) => {
      if(uploadFileList.folder.length == 0){
        return Promise.reject('请选择json文件');
      }
      else{
        return Promise.resolve();
      }
};
const rulesRef = reactive({
    spaceTemplate: [{
        required: true,
        validator: valiFileUploaded,
        trigger: 'change'
    }],
    spaceResource: [{
        required: true,
        message: '请选择文件夹',
        validator: valiFolderUploaded,
        trigger: 'change'
    }]
});
const {
  onResetFields,
  validate,
  validateInfos,
} = useForm(applyForm, rulesRef);
const upLoadData = {
  id : undefined,
  pak : {},
  spaceData: undefined,
  newPak: {},
}
const handleChange = info => {
  let resFileList = [...info.fileList]; 
  resFileList = resFileList.slice(-1); 
  uploadFileList.jsonFile= resFileList;
};
const upLoadJsonFile = (data) => {
  let fileUploaded = new FileReader();
  fileUploaded.readAsText(data.file);
  fileUploaded.onload = function (e) {
    try {
      let result = JSON.parse(e.target.result)
      upLoadData.pak = result.pakResource;
      upLoadData.spaceData = result.spaceData
      for (var key in upLoadData.pak){
        upLoadData.newPak[key.substring(0,1).toLocaleLowerCase()+key.substring(1)] = upLoadData.pak[key];  
          delete(upLoadData.pak[key]);  
        }
      opt.path = configInfo.uploadPath + upLoadData.newPak.pathId + '/';
      data.onSuccess()
    } catch(e){
      proxy.$message.error('上传有误，请重新上传');
      uploadFileList.jsonFile= []
    }
  };
};
const upLoadFolder = (data) => {
  opt.file.push(data);
    opt.folderSize = data.file.size;
    try{
      let id = '';
      const callbackUpload = (params) => {
        if(params.resDataStatus == 0){
          data.onError();
          proxy.$message.error(data.file.name + '服务器内部错误');
        }else if(params.resDataStatus == -1){
          data.onError();
          proxy.$message.error(data.file.name + '网络错误');
        }else if(params.resDataStatus == -2){
          data.onError();
          proxy.$message.error(data.file.name + '请求超时，请稍后重试');
        }else if(params.resDataStatus == -3){
          data.onError();
          proxy.$message.error(data.file.name + '上传出现错误，请稍后重试');
        }
      }
      const callbackSuccess =  (params) => {
        id = params.originId;   
        upLoadData.newPak.assetId = id;
        if(params.resDataStatus == 1){
          data.onSuccess();
          proxy.$message.success(data.file.name + '上传成功');
        }
      }
      uploadFile(opt, callbackUpload, callbackSuccess);
    } catch(error){
      proxy.$message.error(data.file.name + '上传有误，请重新上传');
      data.onError()
    }
    opt.file = []
};
const beforeUpload = file => {
  if(uploadFileList.jsonFile.length == 0){
    uploadFileList.folder = [];
      proxy.$message.warning('请先上传空间模板');
      return Upload.LIST_IGNORE;
   }
};
const save = async()=> {
  let res = await handleReqAct({
    name: 'createSpace',
    datas: {
      spaceData: upLoadData.spaceData,
        pakResource: upLoadData.newPak
    }
  })
  if(res.success) {
    proxy.$message.success('保存成功');
      uploadFileList.folder = [];
      uploadFileList.jsonFile= [];
      emit('changeState',false)
   }else{
     proxy.$message.error('保存失败');
   }
};
const handleOk = async()=> {
  await validate().then(res => {
    save()
  }).catch(err => {
    });
};
const handleCancel = ()=> {
  handleClickCancelBtn(false)
  emit('changeState',false);
};
</script>
<style scoped>
:deep(.ant-upload-list-item-card-actions) {
  display: none;
}
</style>