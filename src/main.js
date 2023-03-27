import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import 'vuetify/styles';
import 'font-awesome/css/font-awesome.min.css'
import { createVuetify } from 'vuetify';

import { aliases, fa } from 'vuetify/iconsets/fa4'
import { mdi } from 'vuetify/iconsets/mdi'
import { VDataTable } from 'vuetify/labs/VDataTable'

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components:{...components, VDataTable},
    directives,
    ssr: true,
    icons: {
        defaultSet: 'fa',
        aliases,
        sets: {
            mdi,
            fa,
        },
    },
});

const app = createApp(App);

app.use(router);
app.use(store);
app.use(vuetify);

app.mount('#app');
