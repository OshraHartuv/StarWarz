import axios from 'axios'

const SWAPI_URL = 'https://swapi.dev/api/'
var gStarWarData = {}
const STORAGE_KEY = 'SW-'
const gCategories = ['planets', 'starships', 'vehicles', 'people', 'films', 'species']

async function loadCategoryData(category, searchTerm) {
    // const storageKey = STORAGE_KEY + searchTerm;
    const storageKey = 'data'
    let starWarData = _loadFromStorage(storageKey) || {}
    if (!starWarData[category]) {
        try {
            const res = await axios.get(SWAPI_URL + category + '/', {
                params: { search: searchTerm },
            })
            starWarData[category] = res.data
        } catch (err) {
            console.log('err ', err)
        }
    }
    gStarWarData = starWarData
    _saveToStorage(storageKey)
    return JSON.parse(JSON.stringify(starWarData))
}

async function getSearchData(searchTerm) {
    // const storageKey = STORAGE_KEY + searchTerm;
    const storageKey = 'data'
    let starWarData = _loadFromStorage(storageKey)
    if (!starWarData) {
        console.log('axiosing.............')
        try {
            const prms = gCategories.map((category) =>
                axios.get(SWAPI_URL + category + '/', {
                    params: { search: searchTerm },
                })
            )
            const values = await Promise.all(prms)
            starWarData = values.reduce((categoriesMap, { data, config: { url } }) => {
                const categoryData = data
                const categoryName = _getCategoryName(url)
                categoriesMap[categoryName] = categoryData
                return categoriesMap
            }, {})
            gStarWarData = starWarData
            _saveToStorage(storageKey)
        } catch (err) {
            console.log('err in service=> getSearchData:', err)
            throw new Error(err)
        }
    }
    return JSON.parse(JSON.stringify(starWarData))
}

async function getNextPage(currData, category, filterBy) {
    console.log('in service')
    // const storageKey = STORAGE_KEY + searchTerm;
    const storageKey = 'data'
    try {
        const res = await axios.get(currData.next)
        const { data } = res
        console.log('res ', data)
        currData.next = data.next
        if (data.results.length) currData.results.push(...data.results)
        gStarWarData[category] = currData
        _saveToStorage(storageKey)
        return JSON.parse(JSON.stringify(gStarWarData[category]))
    } catch (err) {
        console.log('err ', err)
        throw new Error(err)
    }
}

function _getCategoryName(configUrl) {
    const url = new URL(configUrl)
    const pathname = url.pathname
    return pathname.split('/')[2]
}

function _saveToStorage(key) {
    localStorage.setItem(key, JSON.stringify(gStarWarData))
}

function _loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

function getCategoryNames() {
    return [...gCategories]
}

export const service = {
    getSearchData,
    getNextPage,
    loadCategoryData,
    getCategoryNames,
}
