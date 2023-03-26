import { swEditService } from '@/services/sw.edit.service'

export default {
    state: {
        editEntity: null,
    },
    getters: {
        editEntity({ editEntity }) {
            return editEntity
        },
    },
    mutations: {
        setEditEntity(state, { editEntity }) {
            state.editEntity = editEntity
        },
        saveEntity(state, { entity, categoryResults }) {
            console.log('categoryData ', categoryResults)
            const entityIdx = categoryResults.findIndex(e=> e.id === entity.id) 
            if (entityIdx !== -1) categoryResults.splice(entityIdx,1,entity)
        },
    },
    actions: {
        loadSwEntityById({ getters, commit }, { id }) {
            if (!getters.categoryData || !getters.categoryData.results.length) return
            const editEntity = getters.categoryData.results.find((entity) => entity.id === id)
            if (editEntity) commit({ type: 'setEditEntity', editEntity })
        },
        async saveEntity({ getters, commit }, { entityToSave }) {
            try {
                const { category, filterBy, categoryData } = getters
                console.log('category ', category)
                console.log('categoryData ', categoryData)
                if (!category || !categoryData) return
                const savedEntity = await swEditService.saveSwEntity(entityToSave, category, filterBy)
                if (!savedEntity) return 
                commit({ type: 'saveEntity', entity: savedEntity, categoryResults:  categoryData.results})
                commit({ type: 'setEditEntity', editEntity: savedEntity })
            } catch (err) {
                console.error(`Error while saving entity in store => ${err.message}`)
                throw err
            }
        },
    },
}
