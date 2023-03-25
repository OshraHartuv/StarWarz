import axios from 'axios'
import { utilService } from './util-service.js'

const SWAPI_BASE_URL = 'https://swapi.dev/api/'
const CATEGORIES = ['vehicles', 'people']
// const CATEGORIES = ['planets', 'starships', 'vehicles', 'people', 'films', 'species']

async function getSwDataBySearch(searchTerm) {
    try {
        const prms = CATEGORIES.map((category) => _loadSwData(category, searchTerm))
        const values = await Promise.all(prms)
        const dataBySearchTerm = values.reduce((acc, data) => {
            const categoryName = _getCategoryName(data.url)
            acc[categoryName] = data
            return acc
        }, {})
        return dataBySearchTerm
    } catch (err) {
        console.error(`Error while getting search data =>  ${err.message}`)
        throw err
    }
}

async function getNextPage(category, searchTerm) {
    try {
        const currSwCategoryData = await _loadSwData(category, searchTerm)
        const newSwCategoryData = await axios.get(currSwCategoryData.next)
        const { data } = newSwCategoryData
        _makeIds(data.results)
        currSwCategoryData.next = data.next
        currSwCategoryData.results.push(...data.results)
        _saveDataToCache(category, searchTerm, currSwCategoryData)
        return currSwCategoryData
    } catch (err) {
        console.error(`Error while getting next page => ${err.message}`)
        throw err
    }
}

async function loadSwCategoryData(category, searchTerm) {
    //     // const storageKey = STORAGE_KEY + searchTerm;
    //     const storageKey = 'data'
    //     let starWarData = _loadFromStorage(storageKey) || {}
    //     if (!starWarData[category]) {
    //         try {
    //             const res = await axios.get(SWAPI_URL + category + '/', {
    //                 params: { search: searchTerm },
    //             })
    //             const { data } = res
    //             _makeId(data.results)
    //             starWarData[category] = data
    //         } catch (err) {
    //             console.error(`Error while loading category data => service.js:(23) => ${err.message}`);
    //             throw err;
    //         }
    //     }
    //     gStarWarData = starWarData
    //     _saveToStorage(storageKey)
    //     return JSON.parse(JSON.stringify(starWarData))
}

function getCategories() {
    return [...CATEGORIES]
}

async function _loadSwData(category, searchTerm) {
    return _loadSwDataFromCache(category, searchTerm) || (await _loadSwDataFromApi(category, searchTerm))
}

function _loadSwDataFromCache(category, searchTerm) {
    console.log('Getting data from cache')
    let cachedData = localStorage.getItem(category)
    if (!cachedData) return null
    cachedData = JSON.parse(cachedData)
    return cachedData[searchTerm] ? cachedData[searchTerm] : null
}

async function _loadSwDataFromApi(category, searchTerm) {
    console.log('Getting data from api')
    try {
        const response = await axios.get(`${SWAPI_BASE_URL}${category}/?search=${searchTerm}`)
        const { data, config } = response
        _makeIds(data.results)
        const formattedData = { ...data, url: config.url }
        _saveDataToCache(category, searchTerm, formattedData)
        return formattedData
    } catch (err) {
        console.error(`Error while loading data from api => ${err.message}`)
        throw err
    }
}

function _saveDataToCache(category, searchTerm, data) {
    let categoryCache = JSON.parse(localStorage.getItem(category) || '{}')
    categoryCache[searchTerm] = data
    localStorage.setItem(category, JSON.stringify(categoryCache))
}

function _getCategoryName(configUrl) {
    const url = new URL(configUrl)
    const pathname = url.pathname
    return pathname.split('/')[2]
}

function _makeIds(entities) {
    if (entities && entities.length) entities.forEach((entity) => (entity.id = utilService.makeId()))
}

export const swapiService = {
    getSwDataBySearch,
    getCategories,
    getNextPage,
    loadSwCategoryData,
}
