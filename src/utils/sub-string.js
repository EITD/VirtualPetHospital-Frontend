export const subString = (str, len, hasDot) => {
  let newLength = 0
  let newStr = ''
  let chineseRegex = /[^\x00-\xff]/g
  let singleChar = ''
  let strLength = str.replace(chineseRegex, '**').length
  for (let i = 0; i < strLength; i++) {
    singleChar = str.charAt(i).toString()
    if (singleChar.match(chineseRegex) != null) {
      newLength += 2
    }
    else {
      newLength++
    }
    if (newLength > len) {
      break
    }
    newStr += singleChar
  }

  if (hasDot && strLength > len) {
    newStr += '...'
  }
  return newStr
}