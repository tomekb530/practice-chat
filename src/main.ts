import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from '@/firebase'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/md-dark-deeppurple/theme.css';



const app = createApp(App);
app.use(router)
app.use(PrimeVue, {ripple: true})
app.use(ToastService);
app.use(VueFire, {
    firebaseApp: firebaseApp,
    modules: [
      VueFireAuth(),
    ],
})
app.mount('#app')
