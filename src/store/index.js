import { createStore, createLogger } from 'vuex'
import swEditModule from './modules/sw.edit.module'
import swModule from './modules/sw.module'


const store = createStore({
    strict: true,
    // plugins:[createLogger()],
    modules: {
        swEditModule,
        swModule,
    },
})

export default store
