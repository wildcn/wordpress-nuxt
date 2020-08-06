import config from './interface.config';
import path from 'path';

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: '杜连强/创作之旅',
    description: '杜连强 前端工程师 网文爱好者',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', 'data-n-head': true, href: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/10.1.2/styles/androidstudio.min.css' },
      { rel: 'stylesheet', 'data-n-head': true, href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css' }
    ],
    script: [{
      src: 'https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.js',
    }, {
      src: 'http://cdn.bootcss.com/highlight.js/8.0/highlight.min.js',
    }, {
      src: 'https://unpkg.com/element-ui/lib/index.js'
    }, {
      src: '//cdn.bootcdn.net/ajax/libs/vue-router/3.2.0/vue-router.js',
    }, {
      src: '//cdn.bootcdn.net/ajax/libs/lodash.js/4.17.15/lodash.min.js',
    }]
  },
  /*
  ** Global CSS
  */
  css: [
    '@/styles/index.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '~/plugins/wpapi/index.js',
    '~/plugins/github',
    '~/plugins/extend',
    '~/plugins/highlight'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true
  },
  // proxy: {
  //   '/wp': {
  //     target: config.baseUrl,
  //     changeOrigin: true
  //   }
  // },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    transpile: [/^element-ui/],
    extend (config, ctx) {
      if (ctx.isClient) {
        // 添加 alias 配置
        Object.assign(config.resolve.alias, {
          '@components': path.resolve(__dirname, 'components')
        });

        config.externals = config.externals || {};
        Object.assign(config.externals, {
          'vue': 'Vue',
          'element-ui': 'ELEMENT',
          'lodash': '_',
          'vue-router': 'VueRouter'
        })
      }
    },
    analyze: true,
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('js');
    },
    babel: {
      plugins: [
        ["component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ]
    },
  }
}
