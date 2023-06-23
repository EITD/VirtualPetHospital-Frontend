export const getNavigatorLang = () => {
  let navigatorLanguage = 'cn'
  if ((navigator.language || navigator.browserLanguage).toLowerCase().includes('zh') || (navigator.language || navigator.browserLanguage).toLowerCase().includes('cn')) {
    navigatorLanguage = 'cn'
  } else if ((navigator.language || navigator.browserLanguage).toLowerCase().includes('ja') || (navigator.language || navigator.browserLanguage).toLowerCase().includes('jp')) {
    navigatorLanguage = 'jp'
  } else {
    navigatorLanguage = 'en'
  }
  return navigatorLanguage
}