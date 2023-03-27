import axios from 'axios'
import { utilService } from './util.service.js'
import { cacheService } from './cache.service.js'

const SWAPI_BASE_URL = 'https://swapi.dev/api/'
const CATEGORIES = ['vehicles', 'people']
// const CATEGORIES = [ 'people','planets', 'starships', 'vehicles', 'films', 'species']

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
    return cacheService.loadSwCategoryDataFromCache(category, searchTerm) || (await _loadSwCategoryDataFromApi(category, searchTerm))
}

async function getNextPage(category, searchTerm) {
    try {
        // Test this
        const currSwCategoryData = await loadSwCategoryData(category, searchTerm)
        if (!currSwCategoryData.next) return
        const newSwCategoryData = await axios.get(currSwCategoryData.next)
        const { data } = newSwCategoryData
        const formatCategoryEntities = _formatCategoryEntities(category, data.results)
        currSwCategoryData.next = data.next
        currSwCategoryData.results.push(...formatCategoryEntities)
        cacheService.saveSwCategoryDataToCache(category, searchTerm, currSwCategoryData)
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
        data.results = _formatCategoryEntities(category, data.results)
        const formattedData = { ...data, url: config.url }
        cacheService.saveSwCategoryDataToCache(category, searchTerm, formattedData)
        return formattedData
    } catch (err) {
        console.error(`Error while loading data from api => ${err.message}`)
        throw err
    }
}

function _formatCategoryEntities(category, entities) {
    switch (category) {
        case 'people':
            return entities.map(({ name, gender, birth_year, height, mass }) => ({ name, gender, birthYear: birth_year, height, mass, id: utilService.makeId() }))
        case 'films':
            return entities.map(({ title, director, producer, opening_crawl }) => ({ title, director, producer, openingCrawl: opening_crawl, id: utilService.makeId() }))
        case 'starships':
            return entities.map(({ name, model, starship_class, manufacturer }) => ({ name, model, starshipClass: starship_class, manufacturer, id: utilService.makeId() }))
        case 'vehicles':
            return entities.map(({ name, model, vehicle_class, manufacturer }) => ({ name, model, vehicleClass: vehicle_class, manufacturer, id: utilService.makeId() }))
        case 'species':
            return entities.map(({ name, classification, designation, language, homeworld }) => ({ name, classification, designation, language, homeWorld: homeworld, id: utilService.makeId() }))
        case 'planets':
            return entities.map(({ name, diameter, population, climate }) => ({ name, diameter, population, climate, id: utilService.makeId() }))
    }
}

function _getCategoryName(configUrl) {
    const url = new URL(configUrl)
    const pathname = url.pathname
    return pathname.split('/')[2]
}

export const swapiService = {
    getSwDataBySearch,
    loadSwCategoryData,
    getCategories,
    getNextPage,
}
