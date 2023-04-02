import { swapiService } from './swapi.service'

async function saveSwEntity(entityToSave, category, searchTerm) {
    try {
        const allCategoryData = await swapiService.loadSwCategoryData(category, searchTerm)
        if (!allCategoryData?.results?.length) throw new Error('No category data')
        const entityIdx = allCategoryData.results.findIndex((entity) => entity.id === entityToSave.id)
        if (entityIdx === -1) throw new Error("Can't find entity")
        allCategoryData.results.splice(entityIdx, 1, entityToSave)
        saveSwCategoryDataToCache(category, searchTerm, allCategoryData)
        return entityToSave
    } catch (err) {
        console.error(`Error while saving entity in service => ${err.message}`)
        throw err
    }
}

async function removeSwEntity(id, category, searchTerm) {
    try {
        const allCategoryData = await swapiService.loadSwCategoryData(category, searchTerm)
        if (!allCategoryData?.results?.length) throw new Error('No category data')
        const entityIdx = allCategoryData.results.findIndex((entity) => entity.id === id)
        if (entityIdx === -1) throw new Error("Can't find entity")
        allCategoryData.results.splice(entityIdx, 1)
        allCategoryData.count--
        saveSwCategoryDataToCache(category, searchTerm, allCategoryData)
    } catch (err) {
        console.error(`Error while removing entity in service => ${err.message}`)
        throw err
    }
}

function loadSwCategoryDataFromCache(category, searchTerm) {
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

export const cacheService = {
    saveSwEntity,
    removeSwEntity,
    loadSwCategoryDataFromCache,
    saveSwCategoryDataToCache,
}
