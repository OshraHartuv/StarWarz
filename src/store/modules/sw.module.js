import { swapiService } from '@/services/swapi.service.js'

export default {
    state: {
        swData: null,
        filterBy: '',
        category: '',
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
        categoryPageCount({ pageSize }, { categoryCount }) {
            return Math.ceil(categoryCount / pageSize)
        },
        categoryPageSize({ pageSize }) {
            return pageSize
        },
        pageEndIdx({ pageIdx, pageSize, categoryCount }) {
            const endIdx = (pageIdx + 1) * pageSize
            return endIdx > categoryCount ? categoryCount : endIdx
        },
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
        setCategoryData({ swData, category }, { categoryData }) {
            swData[category] = categoryData
        },
        setPage(state, { diff }) {
            state.pageIdx += diff
        },
        saveEntity({ swData, category }, { entity }) {
            const categoryResults = swData[category].results
            const entityIdx = categoryResults.findIndex((e) => e.id === entity.id)
            if (entityIdx !== -1) categoryResults.splice(entityIdx, 1, entity)
        },
        removeEntity({ swData, category }, { entityId }) {
            const { results } = swData[category]
            const entityIdx = results.findIndex((e) => e.id === entityId)
            if (entityIdx === -1) return
            results.splice(entityIdx, 1)
            swData[category].count--
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
                categoryData: { count, results },
            } = getters

            // Checking the index of the entity that will end the next page
            const pageEndIdx = count >= (pageIdx + 2) * pageSize ? (pageIdx + 2) * pageSize : count

            // No need in fetching - entity already in vuex
            if (results.length >= pageEndIdx) return commit({ type: 'setPage', diff })

            // Fetching
            try {
                console.log('going to swapi')
                const newCategoryData = await swapiService.getNextPage(category, filterBy)
                commit({ type: 'setPage', diff })
                commit({ type: 'setCategoryData', categoryData: newCategoryData })
            } catch (err) {
                console.error(`Error while loading next page =>  ${err.message}`)
                throw err
            }
        },
        async setCategory({ commit, state }, { category }) {
            const { swData, filterBy } = state
            commit({ type: 'setCategory', category })
            // Not setting a category means we want to clear our data
            if (!category) {
                return commit({ type: 'setSwData', swData: {} })
            }
            try {
                const newCategoryData = await swapiService.loadSwCategoryData(category, filterBy)
                const swDataCopy = JSON.parse(JSON.stringify(swData)) || {}
                swDataCopy[category] = newCategoryData
                commit({ type: 'setSwData', swData: swDataCopy })
            } catch (err) {
                console.error(`Error while setting category => ${err.message}`)
                throw err
            }
        },
    },
}
