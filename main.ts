import { createApp } from 'vue';
import App from './App.vue';

// Style
import './library/assets/css/main.css';
import 'highlight.js/styles/stackoverflow-light.css';

// PrimeVue
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';
import router from './playground';

import Focus from 'lib/directives/focus';

// Preset
import Preset from './presets';

const app = createApp(App);

// Init PrimeVue
app.use(PrimeVue, {
  unstyled: true,
  pt: Preset.wangsvue,
});

app.provide('preset', Preset.wangsvue);

app.use(router);

app.use(ToastService);
app.directive('tooltip', Tooltip);
app.directive('focus', Focus);

app.mount('#app');
