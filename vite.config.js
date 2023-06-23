import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import styleImport from 'vite-plugin-style-import';
import configJson from './configs/config.json';
import viteCompression from 'vite-plugin-compression';
// console.log(`http://${configJson.serverHostDev}:${configJson.serverPortDev}`);
// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [{
        postcssPlugin: 'internal:charset-removal',
        AtRule: {
          charset: atRule => {
            if (atRule.name === 'charset') {
              atRule.remove()
            }
          }
        }
      }]
    }
  },
  plugins: [
    vue(),
    viteCompression(),
    styleImport({
      libs: [{
        libraryName: 'ant-design-vue',
        esModule: true,
        resolveStyle: (name) => `ant-design-vue/es/${name}/style/css`
      }]
    })
  ],
  server: {
    host: '0.0.0.0',
    port: '4446',
    proxy: {
      '/api': {
        target: `http://localhost:8000`,
        //'http://106.14.123.24',
        // `http://172.20.10.2`,
        // `http://${configJson.serverHostDev}`,
        changeOrigin: true,
        rewrite: pathUrl => pathUrl.replace(/^\/api/, '')
        
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    }
  },
  build: {
    sourcemap: false
  }
});