import { getCurrentInstance, ref } from 'vue'
import axios from 'axios'
export const useUploadBySlice = () => {
  const { proxy } = getCurrentInstance()
  const bytesPerPiece = 8 * 1024 * 1024
  var upload = ref(true)
  const handleClickCancelBtn = async (uploadState) => {
    upload.value = uploadState
  }
  const uploadFile = async (opts, callbackUpload, callbackSuccess) => {
    let { file, uploadEndpoint, path, folderSize } = opts
    if (file) {
      let folderPieces = 0
      let tempBlobSize = 0
      folderPieces = Math.ceil(folderSize / bytesPerPiece)
      let i = 0;
      for (; i < file.length; i++) {
        let originId = null
        let blob = file[i].file
        let start = 0
        let end
        let index = 0
        let filesize = blob.size
        let filename = blob.name
        let totalPieces = 0
        let resDataStatus =  1 //成功
        //计算文件切片总数
        totalPieces = Math.ceil(filesize / bytesPerPiece)
        while (start < filesize || filesize == 0) {
          if(!upload.value) break;
          end = start + bytesPerPiece
          proxy.showLog('File size', start, filesize)
          if (end > filesize) {
            end = filesize
          }
          let chunk = blob.slice(start, end) //切割文件
          let sliceIndex = blob.name + index
          proxy.showLog('sliceIndexs', sliceIndex)
          const formData = new FormData()
          formData.append('file', chunk, filename)
          // formData.append('workspace', 'luoli')
          // formData.append('srs', 'EPSG:4326')
          formData.append('path', path + blob.name)
          formData.append('size', end - start)
          formData.append('offset', start)
          formData.append('total_part', folderPieces)
          formData.append('part', index)
          if (end < filesize) {
            formData.append('last_chunk', false)
          } else {
            formData.append('last_chunk', true)
          }
          try{
            let res = await axios({
              url: uploadEndpoint,
              method: 'POST',
              data: formData,
              timeout: 20000,
            })
            proxy.showLog('Files upload result', res.data)
            if (res?.data?.status === 'SUCCESS' && res?.data?.result?.id) {
              originId = res.data.result.id
            }else if(res?.data?.status !== 'SUCCESS'){
              resDataStatus = 0 //请求失败
              console.log(res?.data?.status)
              callbackUpload({ resDataStatus })
              break; //放弃上传
            }

          }catch(err){
            console.log(err, '----');
            if(err.message ===  "Network Error") resDataStatus = -1 //网络错误
            else if(err.message.includes("timeout") || err.code === 'ECONNABORTED')  resDataStatus = -2 //网络超时
            else {  resDataStatus = -3 }   //上传有误
            callbackUpload({ resDataStatus })
            break;  //放弃上传
          }
          tempBlobSize = tempBlobSize + (end - start)
          // let persent = tempBlobSize / folderSize
          // callbackUpload({ start, filesize, totalPieces, persent, folderPieces })
          start = end
          index++
          // let progress = (i/100) + start
          // callbackUpload({ assetId, start, filesize, totalPieces })
        }
        if(resDataStatus !== 1) break;
        if (end >= filesize && i === file.length - 1) {
          callbackSuccess({ originId, folderSize, resDataStatus })
        }
      }
    }
  }
  return {
    uploadFile, handleClickCancelBtn
  }
}