export const copyAct = () => {
  const copyInput = (dom) => {
    dom.select()
    document.execCommand('copy')
  }
  return {
    copyInput
  }
}