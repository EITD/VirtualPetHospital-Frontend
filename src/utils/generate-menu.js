export const generateMenu = (permissionList) => {
  let menuSetting = [
    { name: '', icon: '' }
  ]
  return filterMenu(menuSetting, permissionList)
}
const filterMenu = (menuSetting, permissionList) => {
  return menuSetting.filter(v => {
    if (permissionList.find(ele => ele.route === v.name)) {
      if (v.child && v.child.length > 0) {
        let childFilter = v.child.filter(c => {
          if (permissionList.find(ele => ele.route === c.name)) return c
        })
        v.child = childFilter
      }
      return v
    }
  })
}