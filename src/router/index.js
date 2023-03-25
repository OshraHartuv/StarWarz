import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import List from '@/views/List.vue'

import { swapiService } from '@/services/swapi.service.js'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/:category/:filterBy',
            name: 'List',
            component: List,
            beforeEnter: (to, from, next) => {
                const category = to.params.category
                const categories = swapiService.getCategories()
                categories.includes(category) ? next() : next({ name: 'Home' })
            },
        },
    ],
})

export default router
