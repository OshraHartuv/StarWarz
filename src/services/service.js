import axios from 'axios'
import { utilService } from './util-service.js'

const SWAPI_URL = 'https://swapi.dev/api/'
const STORAGE_KEY = 'SW_'
const CATEGORIES = ['planets', 'starships', 'vehicles', 'people', 'films', 'species']

var gStarWarData = {}

async function loadCategoryData(category, searchTerm) {
    // const storageKey = STORAGE_KEY + searchTerm;
    const storageKey = 'data'
    let starWarData = _loadFromStorage(storageKey) || {}
    if (!starWarData[category]) {
        try {
            const res = await axios.get(SWAPI_URL + category + '/', {
                params: { search: searchTerm },
            })
            const { data } = res
            _makeId(data.results)
            starWarData[category] = data
        } catch (err) {
            console.error(`Error while loading category data => service.js:(23) => ${err.message}`);
            throw err;
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
            const prms = CATEGORIES.map((category) =>
                axios.get(SWAPI_URL + category + '/', {
                    params: { search: searchTerm },
                })
            )
            const values = await Promise.all(prms)
            starWarData = values.reduce((categoriesMap, { categoryData: data, config: { url } }) => {
                _makeId(data.results)
                const categoryName = _getCategoryName(url)
                categoriesMap[categoryName] = data
                return categoriesMap
            }, {})
            gStarWarData = starWarData
            _saveToStorage(storageKey)
        } catch (err) {
            console.error(`Error while getting search data => service.js:(53) => ${err.message}`)
            throw err
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
        currData.next = data.next
        _makeId(data.results)
        currData.results.push(...data.results)
        gStarWarData[category] = currData
        _saveToStorage(storageKey)
        return JSON.parse(JSON.stringify(gStarWarData[category]))
    } catch (err) {
       console.error(`Error while getting next page => service.js:(74) => ${err.message}`);
       throw err;
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

function _makeId(entities) {
    if (entities && entities.length) entities.forEach((entity) => (entity.id = utilService.makeId()))
}

function getCategoryNames() {
    return [...CATEGORIES]
}

export const service = {
    getSearchData,
    getNextPage,
    loadCategoryData,
    getCategoryNames,
}
