import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import basicSsl from '@vitejs/plugin-basic-ssl'
// import { VitePWA } from 'vite-plugin-pwa'
// import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  },
  plugins: [
    vue()
    // basicSsl(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   devOptions: {
    //     enabled: true
    //   }
    // })
  ],
  resolve: {
    mainFields: ['browser', 'module', 'main', 'jsnext:main', 'jsnext'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 55555,
    host: '0.0.0.0',
    // https: true,
    // watch: {
    //   usePolling: true
    // }
  }
})
