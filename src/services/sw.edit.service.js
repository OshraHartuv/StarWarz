import { swapiService } from './swapi.service'
import { storageService } from './storage.service'

async function saveSwEntity(entityToSave, category, searchTerm) {
    const allCategoryData = await swapiService.loadSwCategoryData(category, searchTerm)
    if (!allCategoryData?.results?.length) return
    const entityIdx = allCategoryData.results.findIndex((entity) => entity.id === entityToSave.id)
    if (entityIdx === -1) return
    allCategoryData.results.splice(entityIdx,1,entityToSave)
    storageService.saveSwCategoryDataToCache(category, searchTerm, allCategoryData)
    return entityToSave
}

// async function getSwEntityById(id, category, searchTerm) {
//     const allCategoryData = await swapiService.loadSwCategoryData(category, searchTerm)
// }

function removeSwEntity(id) {}

export const swEditService = {
    saveSwEntity,
    removeSwEntity,
}
