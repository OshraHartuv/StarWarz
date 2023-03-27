function makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function formatString(str) {
    // Convert string to camel case
    const camelCase = str
        .replace(/[-_]+/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/^./, str.charAt(0).toUpperCase())

    // Split camel case string into words
    const words = camelCase.split(' ')

    // Capitalize each word
    const capitalizedWords = words.map((word, idx) => (idx ? word.charAt(0).toLowerCase() : word.charAt(0).toUpperCase()) + word.slice(1))

    // Join words into final string
    return capitalizedWords.join(' ')
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
    formatString,
}
