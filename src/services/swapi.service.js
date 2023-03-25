import axios from 'axios'
import { utilService } from './util.service.js'
import { storageService } from './storage.service.js'

const SWAPI_BASE_URL = 'https://swapi.dev/api/'
const CATEGORIES = ['vehicles', 'people']
// const CATEGORIES = ['planets', 'starships', 'vehicles', 'people', 'films', 'species']

async function getSwDataBySearch(searchTerm) {
    try {
        const prms = CATEGORIES.map((category) => loadSwCategoryData(category, searchTerm))
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

async function loadSwCategoryData(category, searchTerm) {
    return storageService.loadSwCategoryDataFromCache(category, searchTerm) || (await _loadSwCategoryDataFromApi(category, searchTerm))
}

async function getNextPage(category, searchTerm) {
    try {
        const currSwCategoryData = await loadSwCategoryData(category, searchTerm)
        const newSwCategoryData = await axios.get(currSwCategoryData.next)
        const { data } = newSwCategoryData
        _makeIds(data.results)
        currSwCategoryData.next = data.next
        currSwCategoryData.results.push(...data.results)
        storageService.saveSwCategoryDataToCache(category, searchTerm, currSwCategoryData)
        return currSwCategoryData
    } catch (err) {
        console.error(`Error while getting next page => ${err.message}`)
        throw err
    }
}

function getCategories() {
    return [...CATEGORIES]
}

async function _loadSwCategoryDataFromApi(category, searchTerm) {
    console.log('Getting data from api')
    try {
        const response = await axios.get(`${SWAPI_BASE_URL}${category}/?search=${searchTerm}`)
        const { data, config } = response
        _makeIds(data.results)
        const formattedData = { ...data, url: config.url }
        storageService.saveSwCategoryDataToCache(category, searchTerm, formattedData)
        return formattedData
    } catch (err) {
        console.error(`Error while loading data from api => ${err.message}`)
        throw err
    }
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
    loadSwCategoryData,
    getCategories,
    getNextPage,
}
