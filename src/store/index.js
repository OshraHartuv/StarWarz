import { createStore, createLogger } from 'vuex'
import swModule from './modules/sw.module'


const store = createStore({
    strict: true,
    modules: {
        swModule,
    },
})

export default store
