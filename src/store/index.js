import {createStore} from 'vuex';
import characterModule from './modules/character.module';

const store = createStore({
  strict: true,
  modules: {
    characterModule,
  },
});

export default store;
