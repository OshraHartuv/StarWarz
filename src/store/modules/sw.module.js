import { swapiService } from '@/services/swapi.service.js'
import { cacheService } from '@/services/cache.service'

export default {
    state: {
        swData: {},
        category: '',
        filterBy: '',
        pageIdx: 0,
        pageSize: 10,
    },
    getters: {
        swSearchResults({ swData }) {
            const res = {}
            for (const category in swData) {
                res[category] = swData[category].results.slice(0, 3)
            }
            return res
        },
        filterBy(state) {
            return state.filterBy
        },
        category(state) {
            return state.category
        },
        categoryData({ category, swData }) {
            if (!swData || !category) return
            return swData[category]
        },
        categoryCount({ swData, category }) {
            if (!swData || !category || !swData[category]) return
            return swData[category].count
        },
        categoryEntitiesPerPage({ pageIdx, pageSize }, { pageEndIdx, categoryData }) {
            if (!categoryData) return
            const entities = categoryData.results
            if (!entities) return
            return entities.slice(pageIdx * pageSize, pageEndIdx)
        },
        pageEndIdx({ pageIdx, pageSize, categoryCount }) {
            const endIdx = (pageIdx + 1) * pageSize //The index of the last entity in current page (if the page is full)
            return endIdx > categoryCount ? categoryCount : endIdx
        },
        // pageEndIndex: (pageEnd)=>({ pageSize, categoryCount }) => {
        //     const endIdx = pageEnd * pageSize //The index of the last entity in current page (if the page is full)
        //     console.log('endIdx ',endIdx);
        //     return endIdx > categoryCount ? categoryCount : endIdx
        // },
        hasNextPage({ pageIdx, pageSize }, { categoryCount }) {
            return categoryCount > (pageIdx + 1) * pageSize
        },
        hasPrevPage({ pageIdx }) {
            return pageIdx > 0
        },
    },
    mutations: {
        setSwData(state, { swData }) {
            state.swData = swData
        },
        setFilter(state, { filterBy }) {
            state.filterBy = filterBy
        },
        setCategory(state, { category }) {
            state.category = category
            state.pageIdx = 0
        },
        setCategoryData(state, { categoryData }) {
            state.swData[state.category] = categoryData
        },
        setPage(state, { diff }) {
            state.pageIdx += diff
        },
        saveEntity(state, { entity }) {
            const categoryResults = state.swData[state.category].results
            const entityIdx = categoryResults.findIndex((e) => e.id === entity.id)
            if (entityIdx !== -1) categoryResults.splice(entityIdx, 1, entity)
        },
        removeEntity(state, { entityId }) {
            const results = state.swData[state.category].results
            const entityIdx = results.findIndex((e) => e.id === entityId)
            if (entityIdx === -1) return
            results.splice(entityIdx, 1)
            state.swData[state.category].count--
        },
    },
    actions: {
        async loadResults({ commit, state }) {
            try {
                if (!state.filterBy) return commit({ type: 'setSwData', swData: {} })
                const swData = await swapiService.getSwDataBySearch(state.filterBy)
                commit({ type: 'setSwData', swData })
            } catch (err) {
                console.error(`Error while loading results => ${err.message}`)
                throw err
            }
        },
        async setFilter({ commit, dispatch, state }, { filterBy }) {
            commit({ type: 'setFilter', filterBy })
            if (!state.category) await dispatch({ type: 'loadResults' })
        },
        async setPage({ commit, dispatch }, { diff }) {
            if (diff > 0) await dispatch({ type: 'loadNextPage', diff })
            else commit({ type: 'setPage', diff })
        },
        async loadNextPage({ commit, state, getters }, { diff }) {
            const { category, filterBy, pageIdx, pageSize } = state
            const {
                categoryData: { count: totalEntities, results },
            } = getters

            // Checking the index of the entity that will end the next page
            const nextPage = pageIdx + 2 //Next page num - e.g pageIdx = 0 next page = 2
            const endIdx = nextPage * pageSize //The index of the last entity in the next page (if the page is full)
            const pageEndIdx = totalEntities >= endIdx ? endIdx : totalEntities //Checking what is the end index even if the page is not full
            
            try {
                if (results.length < pageEndIdx) { // Fetching
                    const newCategoryData = await swapiService.getNextPageFromSwapi(category, filterBy)
                    commit({ type: 'setCategoryData', categoryData: newCategoryData })
                }
                commit({ type: 'setPage', diff })
            } catch (err) {
                console.error(`Error while loading next page =>  ${err.message}`)
                throw err
            }
        },
        async setCategory({ commit, state }, { category }) {
            const { filterBy } = state
            commit({ type: 'setCategory', category })
            // Not setting a category means we want to clear our data
            if (!category) return commit({ type: 'setSwData', swData: {} })
            try {
                const newCategoryData = await swapiService.loadSwCategoryData(category, filterBy)
                commit({ type: 'setCategoryData', categoryData: newCategoryData })
            } catch (err) {
                console.error(`Error while setting category => ${err.message}`)
                throw err
            }
        },
        async saveEntity({ getters, commit }, { entityToSave }) {
            try {
                const { category, filterBy, categoryData } = getters
                if (!category || !categoryData) return
                const savedEntity = await cacheService.saveSwEntity(entityToSave, category, filterBy)
                commit({ type: 'saveEntity', entity: savedEntity })
            } catch (err) {
                console.error(`Error while saving entity (${entityToSave.id}) in store => ${err.message}`)
                throw err
            }
        },
        async removeEntity({ getters, commit }, { id }) {
            try {
                const { category, filterBy, categoryData } = getters
                if (!category || !categoryData) return
                await cacheService.removeSwEntity(id, category, filterBy)
                commit({ type: 'removeEntity', entityId: id })
            } catch (err) {
                console.error(`Error while removing entity (${id}) in store => ${err.message}`)
                throw err
            }
        },
    },
}
