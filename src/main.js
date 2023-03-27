import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import Notifications from '@kyvg/vue3-notification'

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as labs from 'vuetify/labs/components'
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components:{...components, ...labs},
    directives,
    ssr: true,
});

const app = createApp(App);

app.use(router);
app.use(store);
app.use(vuetify);
app.use(Notifications)
app.mount('#app');
