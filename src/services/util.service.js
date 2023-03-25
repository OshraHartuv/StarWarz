function makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function debounce(func, wait) {
  let timeout

  return function executedFunction(...args) {
    //rest-makes the args to an array
    const later = () => {
      clearTimeout(timeout)
      func(...args) //spread-from array to vars
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const utilService = {
  makeId,
  getRandomInt,
  debounce,
}
