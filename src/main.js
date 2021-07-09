import { createApp } from 'vue';
import App from './App.vue';

import LoadScript from 'vue-plugin-load-script'; // Plugin Utilizado para carregar script via CDN ou através de arquivos locais.
import mitt from 'mitt'; // Utilizado para emitir ou receber eventos, possibilitando a comunicação entre os componentes da aplicação.

const emitter = mitt();

let app = createApp(App);
app.use(LoadScript);
app.config.globalProperties.emitter = emitter;
app.mount("#app");