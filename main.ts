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
import Preset from 'lib/preset';

const app = createApp(App);

// Init PrimeVue
app.use(PrimeVue, {
  unstyled: true,
  pt: Preset,
});

app.use(router);

app.use(ToastService);
app.directive('tooltip', Tooltip);
app.directive('focus', Focus);

app.mount('#app');
