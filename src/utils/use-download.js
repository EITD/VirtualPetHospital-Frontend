export const useDownload = () => {
  const downloadFile = (fileName, content, type) => {
    let ele = document.createElement('a');
    ele.setAttribute('href', `data:${type},` + encodeURIComponent(content));
    ele.setAttribute('download', fileName);
    ele.click();
  };
  const downloadImg = (fileName, url) => {
    let ele = document.createElement('a');
    ele.href = url;
    ele.download = fileName;
    ele.click();
  };
  return {
    downloadFile, downloadImg
  };
};