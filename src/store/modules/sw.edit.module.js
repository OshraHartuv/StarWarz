export default {
    state: {
        editEntity: null,
    },
    getters: {
        editEntity({editEntity}) {
            return editEntity
        }
    },
    mutations: {
        setEditEntity(state, {editEntity}) {
            state.editEntity = editEntity
        }
    },
    actions: {
        loadSwEntityById({ getters, commit }, { id }) {
            if (!getters.categoryData || !getters.categoryData.results.length) return
            const editEntity = getters.categoryData.results.find((el) => {
                return el.id === id
            })
            console.log('editEntity ',editEntity);
            if (editEntity) commit({ type: 'setEditEntity', editEntity: editEntity })
            console.log('categoryData', editEntity)
        },
    },
}
