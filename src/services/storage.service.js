function loadSwCategoryDataFromCache(category, searchTerm) {
    let cachedData = localStorage.getItem(category)
    if (!cachedData) return null
    console.log('Getting data from cache')
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
