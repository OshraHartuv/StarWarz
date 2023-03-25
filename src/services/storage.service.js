function loadSwCategoryDataFromCache(category, searchTerm) {
    console.log('Getting data from cache')
    let cachedData = localStorage.getItem(category)
    if (!cachedData) return null
    cachedData = JSON.parse(cachedData)
    return cachedData[searchTerm] ? cachedData[searchTerm] : null
}

function saveSwCategoryDataToCache(category, searchTerm, data) {
    let categoryCache = JSON.parse(localStorage.getItem(category) || '{}')
    categoryCache[searchTerm] = data
    localStorage.setItem(category, JSON.stringify(categoryCache))
}




export const storageService = {
    loadSwCategoryDataFromCache,
    saveSwCategoryDataToCache
}
