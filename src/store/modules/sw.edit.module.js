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
                if (!category || !categoryData) return
                await swEditService.saveSwEntity(entityToSave, category, filterBy)
                commit({ type: 'saveEntity', entity: savedEntity})
                commit({ type: 'setEditEntity', editEntity: savedEntity })
            } catch (err) {
                console.error(`Error while saving entity (${entityToSave.id}) in store => ${err.message}`)
                throw err
            }
        },
        async removeEntity({ getters, commit }, { id }) {
            try {
                const { category, filterBy, categoryData } = getters
                if (!category || !categoryData) return
                await swEditService.removeSwEntity(id, category, filterBy)
                commit({ type: 'removeEntity', entityId: id})
                commit({ type: 'setEditEntity', editEntity: {} })
            } catch (err) {
              console.error(`Error while removing entity (${id}) in store => ${err.message}`);
              throw err;
            }
        },
    },
}
