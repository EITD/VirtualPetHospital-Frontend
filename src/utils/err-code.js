import langs from '@/langs'
import i18n from '@/langs/i18n'
let errInstance = null
export class ErrCode {
  static getInstance () {
    if (errInstance === null) errInstance = new ErrCode()
    return errInstance
  }
  getErrMsg (code) {
    let lang = i18n.global.locale
    let system = langs[lang].sys
    return system[`err_${code}`]
  }
}