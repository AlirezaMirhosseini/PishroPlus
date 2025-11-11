import jalaali from 'jalaali-js'
import i18n from './vue-i18n'
import Num2persian from 'num2persian'
import { defaultStore } from '../src/stores/default'

function showNumberInPersianLetters(num) {
  if (!num) return ''
  return Num2persian(num)
}

function gDate2pDateTime(date) {
  if (!date) {
    return null
  }
  const d = new Date(date)
  const res = jalaali.toJalaali(d)
  return `${res.jy}/${res.jm}/${res.jd} - ${d.getHours()}:${d.getMinutes()}`
}

function filterBySearch(search, keyWords, item) {
  if (!search || !search.trim()) return true
  const searchQuery = search.toLowerCase().trim();

  return keyWords.some(field => {
    if (field.includes('.')) {
      const parts = field.split('.');
      let value = item;
      
      for (const part of parts) {
        if (value && typeof value === 'object') {
          value = value[part];
        } else {
          value = undefined;
          break;
        }
      }
      return value !== undefined && 
             value !== null && 
             String(value).toLowerCase().includes(searchQuery);
    }
    const value = item[field];
    return value !== undefined && 
            value !== null && 
            String(value).toLowerCase().includes(searchQuery);
  })
}

function showDocumentStatus(status) {
  switch (status) {
    case 0:
      return { text: i18n.global.t('draft'), color: '#EF884E' }
    case 1:
      return { text: i18n.global.t('operational'), color: '#7D82E3' }
    case 2:
      return { text: i18n.global.t('confirmed'), color: '#588BFF' }
    case 3:
      return { text: i18n.global.t('finalized'), color: '#46BE91' }
    default:
      return {}
  }
}

function showTicketStatus(status) {
  let obj = {}
  switch (status) {
    case 0:
      obj.text = i18n.global.t('opened')
      obj.color = 'primary'
      break
    case 1:
      obj.text = i18n.global.t('waitingForReview')
      obj.color = 'warning'
      break
    case 2:
      obj.text = i18n.global.t('answered')
      obj.color = 'success'
      break
    case 3:
      obj.text = i18n.global.t('closed')
      obj.color = 'error'
      break
    default:
      obj = {}
      break
  }
  return obj
}

function showDocumentType(type) {
  switch (type) {
    case 0:
      return i18n.global.t('check')
    case 1:
      return i18n.global.t('warrantyDocuments')
    case 2:
      return i18n.global.t('cardToCard')
    case 3:
      return i18n.global.t('satna')
    case 4:
      return i18n.global.t('paya')
    case 5:
      return i18n.global.t('cash')
    case 6:
      return i18n.global.t('directPOS')
    case 7:
      return i18n.global.t('manualPOS')
    case 8:
      return i18n.global.t('others')

    default:
      break
  }
}

function showTicketPriority(priority) {
  switch (priority) {
    case 0:
      return i18n.global.t('low')
    case 1:
      return i18n.global.t('average')
    case 2:
      return i18n.global.t('high')
    default:
      return ''
  }
}

function showAccountNature(type) {
  switch (type) {
    case 0:
      return i18n.global.t('neutral')
    case 1:
      return i18n.global.t('debtor')
    case 2:
      return i18n.global.t('creditor')
    default:
      return ''
  }
}

function showAccountType(type) {
  switch (type) {
    case 0:
      return i18n.global.t('permanent')
    case 1:
      return i18n.global.t('interim')
    case 2:
      return i18n.global.t('adjustment')
    case 3:
      return i18n.global.t('detailed')
    default:
      return ''
  }
}

function showAccountFamily(family) {
  switch (family) {
    case 0:
      return i18n.global.t('people')
    case 1:
      return i18n.global.t('stockholder')
    case 2:
      return i18n.global.t('costCenters')
    case 3:
      return i18n.global.t('projects')
    case 4:
      return i18n.global.t('contracts')
    case 5:
      return i18n.global.t('bank')
    case 6:
      return i18n.global.t('cashDesk')
    case 7:
      return i18n.global.t('fund')
    case 8:
      return i18n.global.t('products')
    case 9:
      return i18n.global.t('warehouse')
    case 10:
      return i18n.global.t('other')
    default:
      return ''
  }
}

function showmaximumChildCodeLength(num) {
  switch (num) {
    case 0:
      return i18n.global.t('noSubGroup')
    case 1:
      return i18n.global.t('subGroup') + ' ' + i18n.global.t('singleDigit')
    case 2:
      return i18n.global.t('subGroup') + ' ' + i18n.global.t('doubleDigit')
    case 3:
      return i18n.global.t('subGroup') + ' ' + i18n.global.t('threeDigit')
    case 4:
      return i18n.global.t('subGroup') + ' ' + i18n.global.t('fourDigit')
    case 5:
      return i18n.global.t('subGroup') + ' ' + i18n.global.t('fiveDigit')
    case 6:
      return i18n.global.t('subGroup') + ' ' + i18n.global.t('sixDigit')
    case 7:
      return i18n.global.t('subGroup') + ' ' + i18n.global.t('sevenDigit')
    case 8:
      return i18n.global.t('subGroup') + ' ' + i18n.global.t('eightDigit')
    default:
      return ''
  }
}

function showDate(
  date,
  showTime = false,
  showDayOfWeek = false,
  showSeconds = false,
  showMonthName = false
) {
  if (!date) {
    return null
  }
  var options = {
    weekday: showDayOfWeek ? 'short' : undefined,
    year: 'numeric',
    month: showMonthName ? 'short' : 'numeric',
    day: 'numeric',
    hour: showTime ? 'numeric' : undefined,
    minute: showTime ? 'numeric' : undefined,
    second: showTime ? (showSeconds ? 'numeric' : undefined) : undefined,
    hour12: false
  }
  return p2e(
    new Intl.DateTimeFormat(i18n.global.locale.value === 'fa' ? 'fa-IR' : 'en-US', options).format(
      new Date(date)
    )
  )
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

function checkLength(ev, length = 0) {
  const val = ev.key
  const reg = /^[0-9]+$/
  if (!ev.ctrlKey) {
    if (ev.keyCode !== 8 && ev.keyCode !== 9) {
      if (!reg.test(val) || ev.target.value.length >= length) {
        ev.preventDefault()
      }
    }
  }
}

function gDate2pDate(date) {
  if (!date) {
    return null
  }
  const d = new Date(date)
  const res = jalaali.toJalaali(d)
  return `${res.jy}/${res.jm}/${res.jd}`
}

function recursiveSearch(
  list,
  keyName = 'id',
  keyValue = null,
  subListName = 'children',
  equalToValue = true,
  callback
) {
  if (!list) {
    return
  }
  let resultList = []
  const _recursiveSearch = (
    list,
    keyName = 'id',
    keyValue = null,
    subListName = 'children',
    equalToValue = true,
    callback
  ) => {
    for (let i = 0; i < list.length; i++) {
      const x = list[i]
      if (!keyValue) {
        if (callback) {
          callback.call(this, list, keyName, keyValue, subListName, i)
        }
        if (x[subListName] && x[subListName].length > 0) {
          _recursiveSearch(x[subListName], keyName, keyValue, subListName, equalToValue, callback)
        }
      } else {
        if (
          (equalToValue && x[keyName] === keyValue) ||
          (!equalToValue && x[keyName].includes(keyValue))
        ) {
          if (callback) {
            callback.call(this, list, keyName, keyValue, subListName, i)
          }
          resultList.push(x)
          // continue
        }
        if (x[subListName] && x[subListName].length > 0) {
          const item = _recursiveSearch(
            x[subListName],
            keyName,
            keyValue,
            subListName,
            equalToValue,
            callback
          )
          if (!item || item.length < 1) continue
          resultList = [...item]
        }
      }
    }
    return resultList
  }
  _recursiveSearch(list, keyName, keyValue, subListName, equalToValue, callback)
  return resultList
}

function orderObjectKey(obj, keyOrder) {
  keyOrder.forEach((k) => {
    const v = obj[k]
    delete obj[k]
    obj[k] = v
  })
}

function moveListItem(arr, fromIndex, toIndex) {
  const element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
}

function p2e(val) {
  if (val) {
    return val.toString().replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  }
}

function e2p(val) {
  if (val) {
    return val.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
  }
}

function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

/* eslint-disable */
const rules = {
  required: (value) => !!value || 'تکمیل این فیلد الزامی می باشد',
  mobile: (value) => {
    const pattern = /^09[0-9'@s]{9,9}$/
    return value && !pattern.test(value) ? 'شماره موبایل را به درستی وارد نمایید' : true
  }
}

function generateGUID() {
  // Public Domain/MIT
  var d = new Date().getTime() //Timestamp
  var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0 //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function dataURLtoFile(dataurl, filename) {
  if (!dataurl) return null
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
function customStringify(obj) {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'function') {
      return value.toString()
    }
    return value
  })
}
function customParse(str) {
  return JSON.parse(str, (key, value) => {
    if (typeof value === 'string' && (value.includes('=>') || value.startsWith('function'))) {
      return new Function('return' + value)()
    }
    return value
  })
}
function parseJwt(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
  return JSON.parse(jsonPayload)
}
function addToRecents(item) {
  const token = localStorage.getItem('auth_token')
  if (!token) return

  const tokenData = parseJwt(token)
  if (!tokenData?.user_id) return

  const storageKey = `recentlyVisited_${tokenData.user_id}`
  let recentItems = []
  const storedRecents = localStorage.getItem(storageKey)

  if (storedRecents) {
    recentItems = JSON.parse(storedRecents)
  }

  const index = recentItems.findIndex((i) => i.link === item.link)
  if (index > -1) recentItems.splice(index, 1)

  recentItems.unshift({
    title: item.title,
    link: item.link,
    icon: item.icon,
    iconStyle: item.iconStyle
  })

  if (recentItems.length > 25) {
    recentItems.pop()
  }

  localStorage.setItem(storageKey, JSON.stringify(recentItems))
  const store = defaultStore()
  store.recentTabs = recentItems
}

function showAccountDetection(detection) {
  switch (detection) {
    case 0:
      return i18n.global.t('debtorAbbreviation')
    case 1:
      return '-'
    case 2:
      return i18n.global.t('creditorAbbreviation')
    default:
      return ''
  }
}

function getDetectionByRemaining(remaining) {
  if (remaining < 0) return i18n.global.t('debtorAbbreviation')
  else if (remaining > 0) return i18n.global.t('creditorAbbreviation')
  else return '-'
}

function getSortTypes() {
  return [
    {
      title: i18n.global.t('ascending'),
      value: 'ASC'
    },
    {
      title: i18n.global.t('descending'),
      value: 'DESC'
    }
  ]
}

function getSortTypeName(type) {
  const selected = getSortTypes().find((r) => r.value == type)?.title
  return selected || type
}

function showShopPositions() {
  return [
    {
      title: i18n.global.t('showInShop'),
      value: 1
    },
    {
      title: i18n.global.t('special'),
      value: 2
    },
    {
      title: i18n.global.t('mostPopular'),
      value: 3
    },
    {
      title: i18n.global.t('mostRecent'),
      value: 4
    }
  ]
}

function showShopPositionName(value) {
  const selected = showShopPositions?.find((i) => i.value == value)
  return selected?.title || value
}

export default {
  showNumberInPersianLetters,
  showmaximumChildCodeLength,
  getDetectionByRemaining,
  showAccountDetection,
  showTicketPriority,
  showDocumentStatus,
  showAccountFamily,
  showAccountNature,
  showTicketStatus,
  showDocumentType,
  showAccountType,
  recursiveSearch,
  getSortTypeName,
  gDate2pDateTime,
  filterBySearch,
  orderObjectKey,
  generateGUID,
  getSortTypes,
  moveListItem,
  gDate2pDate,
  checkLength,
  showDate,
  toBase64,
  groupBy,
  e2p,
  p2e,
  dataURLtoFile,
  customStringify,
  customParse,
  addToRecents,
  parseJwt,
  showShopPositions,
  showShopPositionName
}
