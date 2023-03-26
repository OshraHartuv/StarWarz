import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import CategoryTable from '@/views/CategoryTable.vue'
import CategoryEdit from '@/views/CategoryEdit.vue'

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
            name: 'CategoryTable',
            component: CategoryTable,
            beforeEnter: (to, from, next) => {
                const category = to.params.category
                const categories = swapiService.getCategories()
                categories.includes(category) ? next() : next({ name: 'Home' })
            },
            children: [
                {
                    path: 'edit/:id',
                    name: 'CategoryEdit',
                    component: CategoryEdit,
                },
            ],
        },
    ],
})

export default router
