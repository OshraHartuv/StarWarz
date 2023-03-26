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
        categoryData({category, swData}) {
            if (!swData || !category) return 
            return swData[category]
        },
        categoryCount({ swData, category }) {
            if (!swData || !category || !swData[category]) return
            return swData[category].count
        },
        categoryRes({ swData, category, pageIdx, pageSize }) {
            if (!swData || !category || !swData[category]) return
            const categoryData = JSON.parse(JSON.stringify(swData[category]))
            const { count, results } = categoryData
            if (!results || !count) return
            const pageEndIdx = count >= (pageIdx + 1) * pageSize ? (pageIdx + 1) * pageSize : count
            return results.slice(pageIdx * pageSize, pageEndIdx)
        },
        hasNextPage({ swData, pageIdx, pageSize, category }) {
            if (!swData || !category || !swData[category]) return

            const { count } = swData[category]
            return count > (pageIdx + 1) * pageSize
        },
        hasPrevPage({ pageIdx }) {
            return pageIdx > 0
        },
    },
    mutations: {
        setSwData(state, { swData }) {
            console.log('swData ',swData);
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
    },
    actions: {
        async loadResults({ commit, dispatch, state }) {
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
            console.log('setting page')
            if (diff > 0) await dispatch({ type: 'loadNextPage', diff })
            else commit({ type: 'setPage', diff })
        },
        async loadNextPage({ commit, state }, { diff }) {
            console.log('loading next page')

            const { swData, category, filterBy, pageIdx, pageSize } = state
            const currData = JSON.parse(JSON.stringify(swData[category]))
            const { count, results } = currData

            const pageEndIdx = count >= (pageIdx + 2) * pageSize ? (pageIdx + 2) * pageSize : count

            // No need in fetching - already in vuex
            if (results.length >= pageEndIdx) return commit({ type: 'setPage', diff })

            // Fetching
            console.log('going to swapi')
            try {
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
            if (!category || (swData && swData[category])) return
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
