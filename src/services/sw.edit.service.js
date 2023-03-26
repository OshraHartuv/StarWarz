import { swapiService } from './swapi.service'
import { storageService } from './storage.service'

async function saveSwEntity(entityToSave, category, searchTerm) {
    try {
        const allCategoryData = await swapiService.loadSwCategoryData(category, searchTerm)
        if (!allCategoryData?.results?.length) throw new Error('No category data')
        const entityIdx = allCategoryData.results.findIndex((entity) => entity.id === entityToSave.id)
        if (entityIdx === -1) throw new Error('Can\'t find entity')
        allCategoryData.results.splice(entityIdx, 1, entityToSave)
        storageService.saveSwCategoryDataToCache(category, searchTerm, allCategoryData)
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
        if (entityIdx === -1) throw new Error('Can\'t find entity')
        allCategoryData.results.splice(entityIdx, 1)
        allCategoryData.count--
        storageService.saveSwCategoryDataToCache(category, searchTerm, allCategoryData)
    } catch (err) {
        console.error(`Error while removing entity in service => ${err.message}`)
        throw err
    }
}

// async function getSwEntityById(id, category, searchTerm) {
//     const allCategoryData = await swapiService.loadSwCategoryData(category, searchTerm)
// }

export const swEditService = {
    saveSwEntity,
    removeSwEntity,
}
