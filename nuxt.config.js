

const path = require('path');
module.exports = {
  env: {
    baseUrl: process.env.BASE_URL
  },
  telemetry: false, // 关闭nuxt编译时的询问
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
    title: '合生——杜连强的博客',
    description: '杜连强 前端工程师 网文爱好者',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport', content: 'width=device-width, initial-scale=1,user-scalable=no,maximum-scale=1.0'
      },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '杜连强 前端工程师 网文爱好者' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'http://cdn.dulianqiang.com/2020/09/favicon.ico' },
      // 代码样式
      { rel: 'stylesheet', 'data-n-head': true, href: '//cdn.bootcdn.net/ajax/libs/highlight.js/10.1.2/styles/atom-one-dark.min.css' },
      { rel: 'stylesheet', 'data-n-head': true, href: '//cdn.bootcdn.net/ajax/libs/element-ui/2.13.2/theme-chalk/index.css' }
    ],
    script: [{
      src: '//cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.js',
    }, {
      src: '//cdn.bootcdn.net/ajax/libs/element-ui/2.13.2/index.js',

      ssr: true
    }, {
      src: '//cdn.bootcdn.net/ajax/libs/vue-router/3.2.0/vue-router.js',
    }, {
      src: '//cdn.bootcdn.net/ajax/libs/lodash.js/4.17.15/lodash.min.js',
    }, {
      src: process.env.NODE_ENV !== 'development' ? '//hm.baidu.com/hm.js?6ff688864f4019814e3d6ffc4c508fa4' : ''
    }, {
      src: '//cdn.bootcdn.net/ajax/libs/vuex/3.5.1/vuex.min.js'
    }, {
      src: '//cdn.bootcdn.net/ajax/libs/vue-meta/2.4.0/vue-meta.min.js'
    }, {
      src: '//cdn.bootcss.com/highlight.js/8.0/highlight.min.js',
    }, {
      src: '//cdn.bootcdn.net/ajax/libs/highlightjs-line-numbers.js/2.8.0/highlightjs-line-numbers.min.js',
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
    '~/plugins/init',
    '~/plugins/github',
    '~/plugins/extend',
    '~/plugins/highlight',
    '~/plugins/router',
    '~/plugins/moment',
    '~/plugins/wp-xhr',
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
  //     target: config.baseWpApiUrl,
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
          'vue-router': 'VueRouter',
          'vuex': 'Vuex',
          'vue-meta': 'VueMeta'
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
