import { createStore } from 'vuex'
import { service } from '@/services/service.js'
import peopleModule from './modules/people.module'

const store = createStore({
    strict: true,
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
        categoryCount(state) {
            if (!state.swData || !state.category || !state.swData[state.category]) return
            return state.swData[state.category].count
        },
        categoryRes({ swData, category, pageIdx, pageSize }) {
            console.log('swData ', swData)
            if (!swData || !category || !swData[category]) return
            const categoryData = swData[category]
            const totalCount = categoryData.count
            const pageEndIdx = totalCount >= (pageIdx + 1) * pageSize ? (pageIdx + 1) * pageSize : totalCount
            return categoryData.results.slice(pageIdx * pageSize, pageEndIdx)
        },
    },
    mutations: {
        setData(state, { swData }) {
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
        async loadResults({ commit, state }) {
            try {
                if (!state.filterBy) commit({ type: 'setData', swData: '' })
                const swData = await service.getSearchData(state.filterBy)
                commit({ type: 'setData', swData })
            } catch (err) {
                console.log('err in store=> loadResults:', err)
                throw new Error(err)
            }
        },
        async setFilter({ commit, dispatch }, { filterBy }) {
            commit({ type: 'setFilter', filterBy })
            await dispatch({ type: 'loadResults' })
        },
        async setPage({ commit, dispatch }, { diff }) {
            console.log('setting page');
            if (diff > 0) await dispatch({ type: 'loadNextPage', diff })
            else commit({ type: 'setPage', diff })
        },
        async loadNextPage({ commit, state }, { diff }) {
            console.log('loading next page');
            
            const { swData, category, filterBy, pageIdx, pageSize } = state
            const currData = JSON.parse(JSON.stringify(swData[category]))
            const { count, results } = currData

            const pageEndIdx = count >= (pageIdx + 2) * pageSize ? (pageIdx + 2) * pageSize : count

            // No need in fetching - already in vuex
            if (results.length >= pageEndIdx) return commit({ type: 'setPage', diff })

            // Fetching
            console.log('going to swapi')
            try {
                const newCategoryData = await service.getNextPage(currData, category, filterBy)
                commit({ type: 'setPage', diff })
                commit({ type: 'setCategoryData', categoryData: newCategoryData })
            } catch (err) {
                console.log('err ', err)
            }
        },
        async setCategory({ commit, state }, { category }) {
            const { swData, filterBy } = state
            commit({ type: 'setCategory', category })
            if (!swData || !swData[category]) {
                const newData = await service.loadCategoryData(category, filterBy)
                commit({ type: 'setData', swData: newData })
            }
        },
    },
    modules: {
        peopleModule,
    },
})

export default store
