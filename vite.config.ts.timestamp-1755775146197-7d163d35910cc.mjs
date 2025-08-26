// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/vite@5.4.19_@types+node@24.2.1_sass@1.90.0/node_modules/vite/dist/node/index.js";
import { resolve as resolve2 } from "path";

// build/getEnv.ts
function wrapperEnv(envConf) {
  const ret = {};
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT") realName = Number(realName);
    if (envName === "VITE_PROXY") {
      try {
        realName = JSON.parse(realName);
      } catch (error) {
      }
    }
    ret[envName] = realName;
  }
  return ret;
}

// build/proxy.ts
function createProxy(list = []) {
  const ret = {};
  for (const [prefix, target] of list) {
    const httpsRE = /^https:\/\//;
    const isHttps = httpsRE.test(target);
    ret[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ""),
      // https is require secure=false
      ...isHttps ? { secure: false } : {}
    };
  }
  return ret;
}

// build/plugins.ts
import { resolve } from "path";
import { VitePWA } from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/vite-plugin-pwa@0.17.5_vite@5.4.19_workbox-build@7.3.0_workbox-window@7.3.0/node_modules/vite-plugin-pwa/dist/index.js";
import { createHtmlPlugin } from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.4.19/node_modules/vite-plugin-html/dist/index.mjs";
import { visualizer } from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/rollup-plugin-visualizer@5.14.0_rollup@2.79.2/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { createSvgIconsPlugin } from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.19/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import vue from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.19_vue@3.5.18/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.4.19_vue@3.5.18/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import viteCompression from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@5.4.19/node_modules/vite-plugin-compression/dist/index.mjs";
import vueSetupExtend from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/unplugin-vue-setup-extend-plus@1.0.1/node_modules/unplugin-vue-setup-extend-plus/dist/vite.js";
var createVitePlugins = (viteEnv) => {
  const { VITE_GLOB_APP_TITLE, VITE_REPORT, VITE_PWA } = viteEnv;
  return [
    vue(),
    // vue 可以使用 jsx/tsx 语法
    vueJsx(),
    // esLint 报错信息显示在浏览器界面上
    // eslintPlugin(),
    // name 可以写在 script 标签上
    vueSetupExtend({}),
    // 创建打包压缩配置
    createCompression(viteEnv),
    // 注入变量到 html 文件
    createHtmlPlugin({
      minify: true,
      inject: {
        data: { title: VITE_GLOB_APP_TITLE }
      }
    }),
    // 使用 svg 图标
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    }),
    // vitePWA
    VITE_PWA && createVitePwa(viteEnv),
    // 是否生成包预览，分析依赖包大小做优化处理
    VITE_REPORT && visualizer({ filename: "stats.html", gzipSize: true, brotliSize: true })
  ];
};
var createCompression = (viteEnv) => {
  const { VITE_BUILD_COMPRESS = "none", VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;
  const compressList = VITE_BUILD_COMPRESS.split(",");
  const plugins = [];
  if (compressList.includes("gzip")) {
    plugins.push(
      viteCompression({
        ext: ".gz",
        algorithm: "gzip",
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  if (compressList.includes("brotli")) {
    plugins.push(
      viteCompression({
        ext: ".br",
        algorithm: "brotliCompress",
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  return plugins;
};
var createVitePwa = (viteEnv) => {
  const { VITE_GLOB_APP_TITLE } = viteEnv;
  return VitePWA({
    registerType: "autoUpdate",
    workbox: {
      cacheId: "font-cache",
      globPatterns: [],
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "font-images",
            expiration: {
              // 最多30个图
              maxEntries: 30
            }
          }
        },
        {
          urlPattern: /.*\.js.*/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "font-js",
            expiration: {
              maxEntries: 30,
              // 最多缓存30个，超过的按照LRU原则删除
              maxAgeSeconds: 30 * 24 * 60 * 60
            },
            cacheableResponse: {
              statuses: [200]
            }
          }
        },
        {
          urlPattern: /.*\.css.*/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "font-css",
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 30 * 24 * 60 * 60
            },
            cacheableResponse: {
              statuses: [200]
            }
          }
        },
        {
          urlPattern: /.*\.html.*/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "font-html",
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 30 * 24 * 60 * 60
            },
            cacheableResponse: {
              statuses: [200]
            }
          }
        }
      ]
    },
    manifest: {
      name: VITE_GLOB_APP_TITLE,
      short_name: VITE_GLOB_APP_TITLE,
      theme_color: "#ffffff",
      icons: [
        {
          src: "/logo.svg",
          sizes: "192x192",
          type: "image/svg+xml"
        },
        {
          src: "/logo.svg",
          sizes: "512x512",
          type: "image/svg+xml"
        },
        {
          src: "/logo.svg",
          sizes: "512x512",
          type: "image/svg+xml"
        }
      ]
    }
  });
};

// package.json
var package_default = {
  name: "vue-admin",
  private: true,
  version: "1.2.0",
  type: "module",
  description: "vue-admin open source management system",
  scripts: {
    dev: "vite",
    "build:dev": "vue-tsc && vite build --mode development",
    "build:pro": "vue-tsc && vite build --mode production",
    "type:check": "vue-tsc --noEmit --skipLibCheck",
    preview: "npm run build:dev && vite preview",
    "lint:eslint": "eslint --fix --ext .js,.ts,.vue ./src",
    "lint:prettier": 'prettier --write "src/**/*.{js,ts,json,tsx,css,less,scss,vue,html,md}"',
    "lint:stylelint": 'stylelint --cache --fix "**/*.{vue,less,postcss,css,scss}" --cache --cache-location node_modules/.cache/stylelint/',
    "lint:lint-staged": "lint-staged",
    prepare: "husky",
    release: "standard-version",
    commit: "git add -A && czg && git push"
  },
  dependencies: {
    "@element-plus/icons-vue": "^2.3.1",
    "@vueuse/core": "^10.11.0",
    "@wangeditor/editor": "^5.1.23",
    "@wangeditor/editor-for-vue": "^5.1.12",
    axios: "^1.7.2",
    dayjs: "^1.11.11",
    echarts: "^5.5.1",
    "echarts-liquidfill": "^3.1.0",
    "echarts-wordcloud": "^2.1.0",
    "element-plus": "^2.8.0",
    "intersection-observer": "^0.12.2",
    "markmap-lib": "^0.18.12",
    "markmap-view": "^0.18.12",
    md5: "^2.3.0",
    mitt: "^3.0.1",
    nprogress: "^0.2.0",
    pinia: "^2.1.7",
    "pinia-plugin-persistedstate": "^3.2.1",
    qs: "^6.12.3",
    "vue-i18n": "^9.10.1",
    vue: "^3.4.31",
    "vue-demi": "0.14.6",
    "vue-router": "^4.4.0"
  },
  devDependencies: {
    "@commitlint/cli": "^18.6.1",
    "@commitlint/config-conventional": "^18.6.3",
    "@types/md5": "^2.3.5",
    "@types/nprogress": "^0.2.3",
    "@types/qs": "^6.9.15",
    "@typescript-eslint/eslint-plugin": "^7.16.1",
    "@typescript-eslint/parser": "^7.16.1",
    "@vitejs/plugin-vue": "^5.0.5",
    "@vitejs/plugin-vue-jsx": "^3.1.0",
    autoprefixer: "^10.4.19",
    "cz-git": "1.9.0",
    czg: "^1.9.3",
    eslint: "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-prettier": "^5.1.3",
    "eslint-plugin-vue": "^9.27.0",
    husky: "^9.0.11",
    "lint-staged": "^15.2.7",
    postcss: "^8.4.39",
    "postcss-html": "^1.7.0",
    prettier: "^3.3.3",
    "rollup-plugin-visualizer": "^5.12.0",
    sass: "^1.77.8",
    sharp: "^0.33.4",
    "standard-version": "^9.5.0",
    stylelint: "^16.7.0",
    "stylelint-config-html": "^1.1.0",
    "stylelint-config-recess-order": "^5.0.1",
    "stylelint-config-recommended-scss": "^14.1.0",
    "stylelint-config-recommended-vue": "^1.5.0",
    "stylelint-config-standard": "^36.0.1",
    "stylelint-config-standard-scss": "^13.1.0",
    typescript: "^5.5.3",
    "unplugin-vue-setup-extend-plus": "^1.0.1",
    vite: "^5.3.4",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-eslint": "^1.8.1",
    "vite-plugin-html": "^3.2.2",
    "vite-plugin-image-optimizer": "^1.1.8",
    "vite-plugin-pwa": "^0.17.5",
    "vite-plugin-svg-icons": "^2.0.1",
    "vue-tsc": "^2.0.29"
  },
  engines: {
    node: ">=16.0.0"
  },
  browserslist: {
    production: [
      "> 1%",
      "not dead",
      "not op_mini all"
    ],
    development: [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  config: {
    commitizen: {
      path: "node_modules/cz-git"
    }
  }
};

// vite.config.ts
import dayjs from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/dayjs.min.js";
import { ViteImageOptimizer } from "file:///C:/Users/77923/Desktop/SALDB/gkd-web/node_modules/.pnpm/vite-plugin-image-optimizer@1.1.9_vite@5.4.19/node_modules/vite-plugin-image-optimizer/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\77923\\Desktop\\SALDB\\gkd-web";
var { dependencies, devDependencies, name, version } = package_default;
var __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
};
var vite_config_default = defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        "@": resolve2(__vite_injected_original_dirname, "./src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api", "import"],
          api: "modern-compiler",
          additionalData: `@import "@/styles/var.scss";`
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // Load proxy configuration from .env.development
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
    plugins: [
      ...createVitePlugins(viteEnv),
      ViteImageOptimizer({
        svg: {
          // 是否对 SVG 文件进行压缩
          compress: true,
          // 设置 SVG 文件的压缩选项
          options: {
            // 设置 SVG 文件的 XML 属性压缩
            plugins: [
              { name: "preset-default", params: { overrides: { removeViewBox: false } } },
              "sortAttrs",
              "removeUselessStrokeAndFill",
              "cleanupIDs",
              "removeTitle",
              "removeDesc",
              "removeXMLProcInst",
              "removeComments",
              "removeEmptyAttrs",
              "removeHiddenElems",
              "removeEmptyText",
              "convertShapeToPath",
              "convertEllipseToCircle",
              "moveElemsAttrsToGroup",
              "moveGroupAttrsToElems",
              "collapseGroups",
              "removeRasterImages",
              "mergePaths",
              "convertPathData",
              "convertTransform",
              "removeUnknownsAndDefaults",
              "removeNonInheritableGroupAttrs",
              "removeUselessDefs",
              "cleanupNumericValues",
              "cleanupListOfValues",
              "moveElemsFromGroupToGroup",
              "moveStylesToAttrs",
              "removeUnusedNS",
              "cleanupEnableBackground",
              "removeHiddenElems",
              "removeEmptyContainers",
              "cleanupIDs",
              "removeUselessStrokeAndFill",
              "removeViewBox",
              "cleanupNumericValues",
              "convertColors"
            ]
          }
        },
        png: {
          quality: 90
        },
        jpeg: {
          quality: 90
        },
        jpg: {
          quality: 90
        }
      })
    ],
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
    },
    build: {
      outDir: "dist",
      minify: "esbuild",
      // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
      // minify: "terser",
      // terserOptions: {
      //   compress: {
      //     drop_console: viteEnv.VITE_DROP_CONSOLE,
      //     drop_debugger: true
      //   }
      // },
      sourcemap: false,
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: false,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 2e3,
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvZ2V0RW52LnRzIiwgImJ1aWxkL3Byb3h5LnRzIiwgImJ1aWxkL3BsdWdpbnMudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcNzc5MjNcXFxcRGVza3RvcFxcXFxTQUxEQlxcXFxna2Qtd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFw3NzkyM1xcXFxEZXNrdG9wXFxcXFNBTERCXFxcXGdrZC13ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLzc3OTIzL0Rlc2t0b3AvU0FMREIvZ2tkLXdlYi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiwgQ29uZmlnRW52LCBVc2VyQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IHdyYXBwZXJFbnYgfSBmcm9tIFwiLi9idWlsZC9nZXRFbnZcIjtcclxuaW1wb3J0IHsgY3JlYXRlUHJveHkgfSBmcm9tIFwiLi9idWlsZC9wcm94eVwiO1xyXG5pbXBvcnQgeyBjcmVhdGVWaXRlUGx1Z2lucyB9IGZyb20gXCIuL2J1aWxkL3BsdWdpbnNcIjtcclxuaW1wb3J0IHBrZyBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcclxuaW1wb3J0IGRheWpzIGZyb20gXCJkYXlqc1wiO1xyXG5pbXBvcnQgeyBWaXRlSW1hZ2VPcHRpbWl6ZXIgfSBmcm9tIFwidml0ZS1wbHVnaW4taW1hZ2Utb3B0aW1pemVyXCI7XHJcbmNvbnN0IHsgZGVwZW5kZW5jaWVzLCBkZXZEZXBlbmRlbmNpZXMsIG5hbWUsIHZlcnNpb24gfSA9IHBrZztcclxuY29uc3QgX19BUFBfSU5GT19fID0ge1xyXG4gIHBrZzogeyBkZXBlbmRlbmNpZXMsIGRldkRlcGVuZGVuY2llcywgbmFtZSwgdmVyc2lvbiB9LFxyXG4gIGxhc3RCdWlsZFRpbWU6IGRheWpzKCkuZm9ybWF0KFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKVxyXG59O1xyXG5cclxuLy8gQHNlZTogaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfTogQ29uZmlnRW52KTogVXNlckNvbmZpZyA9PiB7XHJcbiAgY29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKCk7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCByb290KTtcclxuICBjb25zdCB2aXRlRW52ID0gd3JhcHBlckVudihlbnYpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgYmFzZTogdml0ZUVudi5WSVRFX1BVQkxJQ19QQVRILFxyXG4gICAgcm9vdCxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgICAgXCJ2dWUtaTE4blwiOiBcInZ1ZS1pMThuL2Rpc3QvdnVlLWkxOG4uY2pzLmpzXCJcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICBfX0FQUF9JTkZPX186IEpTT04uc3RyaW5naWZ5KF9fQVBQX0lORk9fXylcclxuICAgIH0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgIHNpbGVuY2VEZXByZWNhdGlvbnM6IFtcImxlZ2FjeS1qcy1hcGlcIiwgXCJpbXBvcnRcIl0sXHJcbiAgICAgICAgICBhcGk6IFwibW9kZXJuLWNvbXBpbGVyXCIsXHJcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJAL3N0eWxlcy92YXIuc2Nzc1wiO2BcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgaG9zdDogXCIwLjAuMC4wXCIsXHJcbiAgICAgIHBvcnQ6IHZpdGVFbnYuVklURV9QT1JULFxyXG4gICAgICBvcGVuOiB2aXRlRW52LlZJVEVfT1BFTixcclxuICAgICAgY29yczogdHJ1ZSxcclxuICAgICAgLy8gTG9hZCBwcm94eSBjb25maWd1cmF0aW9uIGZyb20gLmVudi5kZXZlbG9wbWVudFxyXG4gICAgICBwcm94eTogY3JlYXRlUHJveHkodml0ZUVudi5WSVRFX1BST1hZKVxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgLi4uY3JlYXRlVml0ZVBsdWdpbnModml0ZUVudiksXHJcbiAgICAgIFZpdGVJbWFnZU9wdGltaXplcih7XHJcbiAgICAgICAgc3ZnOiB7XHJcbiAgICAgICAgICAvLyBcdTY2MkZcdTU0MjZcdTVCRjkgU1ZHIFx1NjU4N1x1NEVGNlx1OEZEQlx1ODg0Q1x1NTM4Qlx1N0YyOVxyXG4gICAgICAgICAgY29tcHJlc3M6IHRydWUsXHJcbiAgICAgICAgICAvLyBcdThCQkVcdTdGNkUgU1ZHIFx1NjU4N1x1NEVGNlx1NzY4NFx1NTM4Qlx1N0YyOVx1OTAwOVx1OTg3OVxyXG4gICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAvLyBcdThCQkVcdTdGNkUgU1ZHIFx1NjU4N1x1NEVGNlx1NzY4NCBYTUwgXHU1QzVFXHU2MDI3XHU1MzhCXHU3RjI5XHJcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgICAgICB7IG5hbWU6IFwicHJlc2V0LWRlZmF1bHRcIiwgcGFyYW1zOiB7IG92ZXJyaWRlczogeyByZW1vdmVWaWV3Qm94OiBmYWxzZSB9IH0gfSxcclxuICAgICAgICAgICAgICBcInNvcnRBdHRyc1wiLFxyXG4gICAgICAgICAgICAgIFwicmVtb3ZlVXNlbGVzc1N0cm9rZUFuZEZpbGxcIixcclxuICAgICAgICAgICAgICBcImNsZWFudXBJRHNcIixcclxuICAgICAgICAgICAgICBcInJlbW92ZVRpdGxlXCIsXHJcbiAgICAgICAgICAgICAgXCJyZW1vdmVEZXNjXCIsXHJcbiAgICAgICAgICAgICAgXCJyZW1vdmVYTUxQcm9jSW5zdFwiLFxyXG4gICAgICAgICAgICAgIFwicmVtb3ZlQ29tbWVudHNcIixcclxuICAgICAgICAgICAgICBcInJlbW92ZUVtcHR5QXR0cnNcIixcclxuICAgICAgICAgICAgICBcInJlbW92ZUhpZGRlbkVsZW1zXCIsXHJcbiAgICAgICAgICAgICAgXCJyZW1vdmVFbXB0eVRleHRcIixcclxuICAgICAgICAgICAgICBcImNvbnZlcnRTaGFwZVRvUGF0aFwiLFxyXG4gICAgICAgICAgICAgIFwiY29udmVydEVsbGlwc2VUb0NpcmNsZVwiLFxyXG4gICAgICAgICAgICAgIFwibW92ZUVsZW1zQXR0cnNUb0dyb3VwXCIsXHJcbiAgICAgICAgICAgICAgXCJtb3ZlR3JvdXBBdHRyc1RvRWxlbXNcIixcclxuICAgICAgICAgICAgICBcImNvbGxhcHNlR3JvdXBzXCIsXHJcbiAgICAgICAgICAgICAgXCJyZW1vdmVSYXN0ZXJJbWFnZXNcIixcclxuICAgICAgICAgICAgICBcIm1lcmdlUGF0aHNcIixcclxuICAgICAgICAgICAgICBcImNvbnZlcnRQYXRoRGF0YVwiLFxyXG4gICAgICAgICAgICAgIFwiY29udmVydFRyYW5zZm9ybVwiLFxyXG4gICAgICAgICAgICAgIFwicmVtb3ZlVW5rbm93bnNBbmREZWZhdWx0c1wiLFxyXG4gICAgICAgICAgICAgIFwicmVtb3ZlTm9uSW5oZXJpdGFibGVHcm91cEF0dHJzXCIsXHJcbiAgICAgICAgICAgICAgXCJyZW1vdmVVc2VsZXNzRGVmc1wiLFxyXG4gICAgICAgICAgICAgIFwiY2xlYW51cE51bWVyaWNWYWx1ZXNcIixcclxuICAgICAgICAgICAgICBcImNsZWFudXBMaXN0T2ZWYWx1ZXNcIixcclxuICAgICAgICAgICAgICBcIm1vdmVFbGVtc0Zyb21Hcm91cFRvR3JvdXBcIixcclxuICAgICAgICAgICAgICBcIm1vdmVTdHlsZXNUb0F0dHJzXCIsXHJcbiAgICAgICAgICAgICAgXCJyZW1vdmVVbnVzZWROU1wiLFxyXG4gICAgICAgICAgICAgIFwiY2xlYW51cEVuYWJsZUJhY2tncm91bmRcIixcclxuICAgICAgICAgICAgICBcInJlbW92ZUhpZGRlbkVsZW1zXCIsXHJcbiAgICAgICAgICAgICAgXCJyZW1vdmVFbXB0eUNvbnRhaW5lcnNcIixcclxuICAgICAgICAgICAgICBcImNsZWFudXBJRHNcIixcclxuICAgICAgICAgICAgICBcInJlbW92ZVVzZWxlc3NTdHJva2VBbmRGaWxsXCIsXHJcbiAgICAgICAgICAgICAgXCJyZW1vdmVWaWV3Qm94XCIsXHJcbiAgICAgICAgICAgICAgXCJjbGVhbnVwTnVtZXJpY1ZhbHVlc1wiLFxyXG4gICAgICAgICAgICAgIFwiY29udmVydENvbG9yc1wiXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHBuZzoge1xyXG4gICAgICAgICAgcXVhbGl0eTogOTBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGpwZWc6IHtcclxuICAgICAgICAgIHF1YWxpdHk6IDkwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBqcGc6IHtcclxuICAgICAgICAgIHF1YWxpdHk6IDkwXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgXSxcclxuXHJcbiAgICBlc2J1aWxkOiB7XHJcbiAgICAgIHB1cmU6IHZpdGVFbnYuVklURV9EUk9QX0NPTlNPTEUgPyBbXCJjb25zb2xlLmxvZ1wiLCBcImRlYnVnZ2VyXCJdIDogW11cclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBvdXREaXI6IFwiZGlzdFwiLFxyXG4gICAgICBtaW5pZnk6IFwiZXNidWlsZFwiLFxyXG4gICAgICAvLyBlc2J1aWxkIFx1NjI1M1x1NTMwNVx1NjZGNFx1NUZFQlx1RkYwQ1x1NEY0Nlx1NjYyRlx1NEUwRFx1ODBGRFx1NTNCQlx1OTY2NCBjb25zb2xlLmxvZ1x1RkYwQ3RlcnNlclx1NjI1M1x1NTMwNVx1NjE2Mlx1RkYwQ1x1NEY0Nlx1ODBGRFx1NTNCQlx1OTY2NCBjb25zb2xlLmxvZ1xyXG4gICAgICAvLyBtaW5pZnk6IFwidGVyc2VyXCIsXHJcbiAgICAgIC8vIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgLy8gICBjb21wcmVzczoge1xyXG4gICAgICAvLyAgICAgZHJvcF9jb25zb2xlOiB2aXRlRW52LlZJVEVfRFJPUF9DT05TT0xFLFxyXG4gICAgICAvLyAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZVxyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfSxcclxuICAgICAgc291cmNlbWFwOiBmYWxzZSxcclxuICAgICAgLy8gXHU3OTgxXHU3NTI4IGd6aXAgXHU1MzhCXHU3RjI5XHU1OTI3XHU1QzBGXHU2MkE1XHU1NDRBXHVGRjBDXHU1M0VGXHU3NTY1XHU1RkFFXHU1MUNGXHU1QzExXHU2MjUzXHU1MzA1XHU2NUY2XHU5NUY0XHJcbiAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSxcclxuICAgICAgLy8gXHU4OUM0XHU1QjlBXHU4OUU2XHU1M0QxXHU4QjY2XHU1NDRBXHU3Njg0IGNodW5rIFx1NTkyN1x1NUMwRlxyXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwMDAsXHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgIC8vIFN0YXRpYyByZXNvdXJjZSBjbGFzc2lmaWNhdGlvbiBhbmQgcGFja2FnaW5nXHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qc1wiLFxyXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwiYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanNcIixcclxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiBcImFzc2V0cy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdXCJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG59KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFw3NzkyM1xcXFxEZXNrdG9wXFxcXFNBTERCXFxcXGdrZC13ZWJcXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDc3OTIzXFxcXERlc2t0b3BcXFxcU0FMREJcXFxcZ2tkLXdlYlxcXFxidWlsZFxcXFxnZXRFbnYudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLzc3OTIzL0Rlc2t0b3AvU0FMREIvZ2tkLXdlYi9idWlsZC9nZXRFbnYudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRGV2Rm4obW9kZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvZEZuKG1vZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBtb2RlID09PSBcInByb2R1Y3Rpb25cIjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVGVzdEZuKG1vZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBtb2RlID09PSBcInRlc3RcIjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFdoZXRoZXIgdG8gZ2VuZXJhdGUgcGFja2FnZSBwcmV2aWV3XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNSZXBvcnRNb2RlKCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBwcm9jZXNzLmVudi5WSVRFX1JFUE9SVCA9PT0gXCJ0cnVlXCI7XHJcbn1cclxuXHJcbi8vIFJlYWQgYWxsIGVudmlyb25tZW50IHZhcmlhYmxlIGNvbmZpZ3VyYXRpb24gZmlsZXMgdG8gcHJvY2Vzcy5lbnZcclxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBwZXJFbnYoZW52Q29uZjogUmVjb3JkYWJsZSk6IFZpdGVFbnYge1xyXG4gIGNvbnN0IHJldDogYW55ID0ge307XHJcblxyXG4gIGZvciAoY29uc3QgZW52TmFtZSBvZiBPYmplY3Qua2V5cyhlbnZDb25mKSkge1xyXG4gICAgbGV0IHJlYWxOYW1lID0gZW52Q29uZltlbnZOYW1lXS5yZXBsYWNlKC9cXFxcbi9nLCBcIlxcblwiKTtcclxuICAgIHJlYWxOYW1lID0gcmVhbE5hbWUgPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IHJlYWxOYW1lID09PSBcImZhbHNlXCIgPyBmYWxzZSA6IHJlYWxOYW1lO1xyXG4gICAgaWYgKGVudk5hbWUgPT09IFwiVklURV9QT1JUXCIpIHJlYWxOYW1lID0gTnVtYmVyKHJlYWxOYW1lKTtcclxuICAgIGlmIChlbnZOYW1lID09PSBcIlZJVEVfUFJPWFlcIikge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJlYWxOYW1lID0gSlNPTi5wYXJzZShyZWFsTmFtZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgfVxyXG4gICAgcmV0W2Vudk5hbWVdID0gcmVhbE5hbWU7XHJcbiAgfVxyXG4gIHJldHVybiByZXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdXNlciByb290IGRpcmVjdG9yeVxyXG4gKiBAcGFyYW0gZGlyIGZpbGUgcGF0aFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJvb3RQYXRoKC4uLmRpcjogc3RyaW5nW10pIHtcclxuICByZXR1cm4gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIC4uLmRpcik7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFw3NzkyM1xcXFxEZXNrdG9wXFxcXFNBTERCXFxcXGdrZC13ZWJcXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDc3OTIzXFxcXERlc2t0b3BcXFxcU0FMREJcXFxcZ2tkLXdlYlxcXFxidWlsZFxcXFxwcm94eS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvNzc5MjMvRGVza3RvcC9TQUxEQi9na2Qtd2ViL2J1aWxkL3Byb3h5LnRzXCI7aW1wb3J0IHR5cGUgeyBQcm94eU9wdGlvbnMgfSBmcm9tIFwidml0ZVwiO1xyXG5cclxudHlwZSBQcm94eUl0ZW0gPSBbc3RyaW5nLCBzdHJpbmddO1xyXG5cclxudHlwZSBQcm94eUxpc3QgPSBQcm94eUl0ZW1bXTtcclxuXHJcbnR5cGUgUHJveHlUYXJnZXRMaXN0ID0gUmVjb3JkPHN0cmluZywgUHJveHlPcHRpb25zPjtcclxuXHJcbi8qKlxyXG4gKiBcdTUyMUJcdTVFRkFcdTRFRTNcdTc0MDZcdUZGMENcdTc1MjhcdTRFOEVcdTg5RTNcdTY3OTAgLmVudi5kZXZlbG9wbWVudCBcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcclxuICogQHBhcmFtIGxpc3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcm94eShsaXN0OiBQcm94eUxpc3QgPSBbXSkge1xyXG4gIGNvbnN0IHJldDogUHJveHlUYXJnZXRMaXN0ID0ge307XHJcbiAgZm9yIChjb25zdCBbcHJlZml4LCB0YXJnZXRdIG9mIGxpc3QpIHtcclxuICAgIGNvbnN0IGh0dHBzUkUgPSAvXmh0dHBzOlxcL1xcLy87XHJcbiAgICBjb25zdCBpc0h0dHBzID0gaHR0cHNSRS50ZXN0KHRhcmdldCk7XHJcblxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2h0dHAtcGFydHkvbm9kZS1odHRwLXByb3h5I29wdGlvbnNcclxuICAgIHJldFtwcmVmaXhdID0ge1xyXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICB3czogdHJ1ZSxcclxuICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7cHJlZml4fWApLCBcIlwiKSxcclxuICAgICAgLy8gaHR0cHMgaXMgcmVxdWlyZSBzZWN1cmU9ZmFsc2VcclxuICAgICAgLi4uKGlzSHR0cHMgPyB7IHNlY3VyZTogZmFsc2UgfSA6IHt9KVxyXG4gICAgfTtcclxuICB9XHJcbiAgcmV0dXJuIHJldDtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDc3OTIzXFxcXERlc2t0b3BcXFxcU0FMREJcXFxcZ2tkLXdlYlxcXFxidWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcNzc5MjNcXFxcRGVza3RvcFxcXFxTQUxEQlxcXFxna2Qtd2ViXFxcXGJ1aWxkXFxcXHBsdWdpbnMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLzc3OTIzL0Rlc2t0b3AvU0FMREIvZ2tkLXdlYi9idWlsZC9wbHVnaW5zLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4taHRtbFwiO1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiO1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCB2dWVKc3ggZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZS1qc3hcIjtcclxuLy8gaW1wb3J0IGVzbGludFBsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tZXNsaW50XCI7XHJcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSBcInZpdGUtcGx1Z2luLWNvbXByZXNzaW9uXCI7XHJcbmltcG9ydCB2dWVTZXR1cEV4dGVuZCBmcm9tIFwidW5wbHVnaW4tdnVlLXNldHVwLWV4dGVuZC1wbHVzL3ZpdGVcIjtcclxuXHJcbi8qKlxyXG4gKiBcdTUyMUJcdTVFRkEgdml0ZSBcdTYzRDJcdTRFRjZcclxuICogQHBhcmFtIHZpdGVFbnZcclxuICovXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVWaXRlUGx1Z2lucyA9ICh2aXRlRW52OiBWaXRlRW52KTogKFBsdWdpbk9wdGlvbiB8IFBsdWdpbk9wdGlvbltdKVtdID0+IHtcclxuICBjb25zdCB7IFZJVEVfR0xPQl9BUFBfVElUTEUsIFZJVEVfUkVQT1JULCBWSVRFX1BXQSB9ID0gdml0ZUVudjtcclxuICByZXR1cm4gW1xyXG4gICAgdnVlKCksXHJcbiAgICAvLyB2dWUgXHU1M0VGXHU0RUU1XHU0RjdGXHU3NTI4IGpzeC90c3ggXHU4QkVEXHU2Q0Q1XHJcbiAgICB2dWVKc3goKSxcclxuICAgIC8vIGVzTGludCBcdTYyQTVcdTk1MTlcdTRGRTFcdTYwNkZcdTY2M0VcdTc5M0FcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTc1NENcdTk3NjJcdTRFMEFcclxuICAgIC8vIGVzbGludFBsdWdpbigpLFxyXG4gICAgLy8gbmFtZSBcdTUzRUZcdTRFRTVcdTUxOTlcdTU3Mjggc2NyaXB0IFx1NjgwN1x1N0I3RVx1NEUwQVxyXG4gICAgdnVlU2V0dXBFeHRlbmQoe30pLFxyXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU2MjUzXHU1MzA1XHU1MzhCXHU3RjI5XHU5MTREXHU3RjZFXHJcbiAgICBjcmVhdGVDb21wcmVzc2lvbih2aXRlRW52KSxcclxuICAgIC8vIFx1NkNFOFx1NTE2NVx1NTNEOFx1OTFDRlx1NTIzMCBodG1sIFx1NjU4N1x1NEVGNlxyXG4gICAgY3JlYXRlSHRtbFBsdWdpbih7XHJcbiAgICAgIG1pbmlmeTogdHJ1ZSxcclxuICAgICAgaW5qZWN0OiB7XHJcbiAgICAgICAgZGF0YTogeyB0aXRsZTogVklURV9HTE9CX0FQUF9USVRMRSB9XHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gICAgLy8gXHU0RjdGXHU3NTI4IHN2ZyBcdTU2RkVcdTY4MDdcclxuICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgaWNvbkRpcnM6IFtyZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwic3JjL2Fzc2V0cy9pY29uc1wiKV0sXHJcbiAgICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCJcclxuICAgIH0pLFxyXG4gICAgLy8gdml0ZVBXQVxyXG4gICAgVklURV9QV0EgJiYgY3JlYXRlVml0ZVB3YSh2aXRlRW52KSxcclxuICAgIC8vIFx1NjYyRlx1NTQyNlx1NzUxRlx1NjIxMFx1NTMwNVx1OTg4NFx1ODlDOFx1RkYwQ1x1NTIwNlx1Njc5MFx1NEY5RFx1OEQ1Nlx1NTMwNVx1NTkyN1x1NUMwRlx1NTA1QVx1NEYxOFx1NTMxNlx1NTkwNFx1NzQwNlxyXG4gICAgVklURV9SRVBPUlQgJiYgKHZpc3VhbGl6ZXIoeyBmaWxlbmFtZTogXCJzdGF0cy5odG1sXCIsIGd6aXBTaXplOiB0cnVlLCBicm90bGlTaXplOiB0cnVlIH0pIGFzIFBsdWdpbk9wdGlvbilcclxuICBdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBcdTY4MzlcdTYzNkUgY29tcHJlc3MgXHU5MTREXHU3RjZFXHVGRjBDXHU3NTFGXHU2MjEwXHU0RTBEXHU1NDBDXHU3Njg0XHU1MzhCXHU3RjI5XHU4OUM0XHU1MjE5XHJcbiAqIEBwYXJhbSB2aXRlRW52XHJcbiAqL1xyXG5jb25zdCBjcmVhdGVDb21wcmVzc2lvbiA9ICh2aXRlRW52OiBWaXRlRW52KTogUGx1Z2luT3B0aW9uIHwgUGx1Z2luT3B0aW9uW10gPT4ge1xyXG4gIGNvbnN0IHsgVklURV9CVUlMRF9DT01QUkVTUyA9IFwibm9uZVwiLCBWSVRFX0JVSUxEX0NPTVBSRVNTX0RFTEVURV9PUklHSU5fRklMRSB9ID0gdml0ZUVudjtcclxuICBjb25zdCBjb21wcmVzc0xpc3QgPSBWSVRFX0JVSUxEX0NPTVBSRVNTLnNwbGl0KFwiLFwiKTtcclxuICBjb25zdCBwbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IFtdO1xyXG4gIGlmIChjb21wcmVzc0xpc3QuaW5jbHVkZXMoXCJnemlwXCIpKSB7XHJcbiAgICBwbHVnaW5zLnB1c2goXHJcbiAgICAgIHZpdGVDb21wcmVzc2lvbih7XHJcbiAgICAgICAgZXh0OiBcIi5nelwiLFxyXG4gICAgICAgIGFsZ29yaXRobTogXCJnemlwXCIsXHJcbiAgICAgICAgZGVsZXRlT3JpZ2luRmlsZTogVklURV9CVUlMRF9DT01QUkVTU19ERUxFVEVfT1JJR0lOX0ZJTEVcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG4gIGlmIChjb21wcmVzc0xpc3QuaW5jbHVkZXMoXCJicm90bGlcIikpIHtcclxuICAgIHBsdWdpbnMucHVzaChcclxuICAgICAgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgICBleHQ6IFwiLmJyXCIsXHJcbiAgICAgICAgYWxnb3JpdGhtOiBcImJyb3RsaUNvbXByZXNzXCIsXHJcbiAgICAgICAgZGVsZXRlT3JpZ2luRmlsZTogVklURV9CVUlMRF9DT01QUkVTU19ERUxFVEVfT1JJR0lOX0ZJTEVcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG4gIHJldHVybiBwbHVnaW5zO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBWaXRlUHdhXHJcbiAqIEBwYXJhbSB2aXRlRW52XHJcbiAqL1xyXG5jb25zdCBjcmVhdGVWaXRlUHdhID0gKHZpdGVFbnY6IFZpdGVFbnYpOiBQbHVnaW5PcHRpb24gfCBQbHVnaW5PcHRpb25bXSA9PiB7XHJcbiAgY29uc3QgeyBWSVRFX0dMT0JfQVBQX1RJVExFIH0gPSB2aXRlRW52O1xyXG4gIHJldHVybiBWaXRlUFdBKHtcclxuICAgIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsXHJcbiAgICB3b3JrYm94OiB7XHJcbiAgICAgIGNhY2hlSWQ6IFwiZm9udC1jYWNoZVwiLFxyXG4gICAgICBnbG9iUGF0dGVybnM6IFtdLFxyXG4gICAgICBuYXZpZ2F0ZUZhbGxiYWNrOiBudWxsLFxyXG4gICAgICBydW50aW1lQ2FjaGluZzogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHVybFBhdHRlcm46IC9cXC4oPzpwbmd8anBnfGpwZWd8c3ZnKSQvLFxyXG4gICAgICAgICAgaGFuZGxlcjogXCJDYWNoZUZpcnN0XCIsXHJcbiAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIGNhY2hlTmFtZTogXCJmb250LWltYWdlc1wiLFxyXG4gICAgICAgICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgLy8gXHU2NzAwXHU1OTFBMzBcdTRFMkFcdTU2RkVcclxuICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAzMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB1cmxQYXR0ZXJuOiAvLipcXC5qcy4qLyxcclxuICAgICAgICAgIGhhbmRsZXI6IFwiU3RhbGVXaGlsZVJldmFsaWRhdGVcIixcclxuICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgY2FjaGVOYW1lOiBcImZvbnQtanNcIixcclxuICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xyXG4gICAgICAgICAgICAgIG1heEVudHJpZXM6IDMwLCAvLyBcdTY3MDBcdTU5MUFcdTdGMTNcdTVCNTgzMFx1NEUyQVx1RkYwQ1x1OEQ4NVx1OEZDN1x1NzY4NFx1NjMwOVx1NzE2N0xSVVx1NTM5Rlx1NTIxOVx1NTIyMFx1OTY2NFxyXG4gICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDMwICogMjQgKiA2MCAqIDYwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XHJcbiAgICAgICAgICAgICAgc3RhdHVzZXM6IFsyMDBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHVybFBhdHRlcm46IC8uKlxcLmNzcy4qLyxcclxuICAgICAgICAgIGhhbmRsZXI6IFwiU3RhbGVXaGlsZVJldmFsaWRhdGVcIixcclxuICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgY2FjaGVOYW1lOiBcImZvbnQtY3NzXCIsXHJcbiAgICAgICAgICAgIGV4cGlyYXRpb246IHtcclxuICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAyMCxcclxuICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiAzMCAqIDI0ICogNjAgKiA2MFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xyXG4gICAgICAgICAgICAgIHN0YXR1c2VzOiBbMjAwXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB1cmxQYXR0ZXJuOiAvLipcXC5odG1sLiovLFxyXG4gICAgICAgICAgaGFuZGxlcjogXCJTdGFsZVdoaWxlUmV2YWxpZGF0ZVwiLFxyXG4gICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICBjYWNoZU5hbWU6IFwiZm9udC1odG1sXCIsXHJcbiAgICAgICAgICAgIGV4cGlyYXRpb246IHtcclxuICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAyMCxcclxuICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiAzMCAqIDI0ICogNjAgKiA2MFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xyXG4gICAgICAgICAgICAgIHN0YXR1c2VzOiBbMjAwXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgbWFuaWZlc3Q6IHtcclxuICAgICAgbmFtZTogVklURV9HTE9CX0FQUF9USVRMRSxcclxuICAgICAgc2hvcnRfbmFtZTogVklURV9HTE9CX0FQUF9USVRMRSxcclxuICAgICAgdGhlbWVfY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gICAgICBpY29uczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCIvbG9nby5zdmdcIixcclxuICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcclxuICAgICAgICAgIHR5cGU6IFwiaW1hZ2Uvc3ZnK3htbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzcmM6IFwiL2xvZ28uc3ZnXCIsXHJcbiAgICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXHJcbiAgICAgICAgICB0eXBlOiBcImltYWdlL3N2Zyt4bWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiBcIi9sb2dvLnN2Z1wiLFxyXG4gICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgdHlwZTogXCJpbWFnZS9zdmcreG1sXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICB9KTtcclxufTtcclxuIiwgIntcclxuICBcIm5hbWVcIjogXCJ2dWUtYWRtaW5cIixcclxuICBcInByaXZhdGVcIjogdHJ1ZSxcclxuICBcInZlcnNpb25cIjogXCIxLjIuMFwiLFxyXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJ2dWUtYWRtaW4gb3BlbiBzb3VyY2UgbWFuYWdlbWVudCBzeXN0ZW1cIixcclxuICBcInNjcmlwdHNcIjoge1xyXG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXHJcbiAgICBcImJ1aWxkOmRldlwiOiBcInZ1ZS10c2MgJiYgdml0ZSBidWlsZCAtLW1vZGUgZGV2ZWxvcG1lbnRcIixcclxuICAgIFwiYnVpbGQ6cHJvXCI6IFwidnVlLXRzYyAmJiB2aXRlIGJ1aWxkIC0tbW9kZSBwcm9kdWN0aW9uXCIsXHJcbiAgICBcInR5cGU6Y2hlY2tcIjogXCJ2dWUtdHNjIC0tbm9FbWl0IC0tc2tpcExpYkNoZWNrXCIsXHJcbiAgICBcInByZXZpZXdcIjogXCJucG0gcnVuIGJ1aWxkOmRldiAmJiB2aXRlIHByZXZpZXdcIixcclxuICAgIFwibGludDplc2xpbnRcIjogXCJlc2xpbnQgLS1maXggLS1leHQgLmpzLC50cywudnVlIC4vc3JjXCIsXHJcbiAgICBcImxpbnQ6cHJldHRpZXJcIjogXCJwcmV0dGllciAtLXdyaXRlIFxcXCJzcmMvKiovKi57anMsdHMsanNvbix0c3gsY3NzLGxlc3Msc2Nzcyx2dWUsaHRtbCxtZH1cXFwiXCIsXHJcbiAgICBcImxpbnQ6c3R5bGVsaW50XCI6IFwic3R5bGVsaW50IC0tY2FjaGUgLS1maXggXFxcIioqLyoue3Z1ZSxsZXNzLHBvc3Rjc3MsY3NzLHNjc3N9XFxcIiAtLWNhY2hlIC0tY2FjaGUtbG9jYXRpb24gbm9kZV9tb2R1bGVzLy5jYWNoZS9zdHlsZWxpbnQvXCIsXHJcbiAgICBcImxpbnQ6bGludC1zdGFnZWRcIjogXCJsaW50LXN0YWdlZFwiLFxyXG4gICAgXCJwcmVwYXJlXCI6IFwiaHVza3lcIixcclxuICAgIFwicmVsZWFzZVwiOiBcInN0YW5kYXJkLXZlcnNpb25cIixcclxuICAgIFwiY29tbWl0XCI6IFwiZ2l0IGFkZCAtQSAmJiBjemcgJiYgZ2l0IHB1c2hcIlxyXG4gIH0sXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZVwiOiBcIl4yLjMuMVwiLFxyXG4gICAgXCJAdnVldXNlL2NvcmVcIjogXCJeMTAuMTEuMFwiLFxyXG4gICAgXCJAd2FuZ2VkaXRvci9lZGl0b3JcIjogXCJeNS4xLjIzXCIsXHJcbiAgICBcIkB3YW5nZWRpdG9yL2VkaXRvci1mb3ItdnVlXCI6IFwiXjUuMS4xMlwiLFxyXG4gICAgXCJheGlvc1wiOiBcIl4xLjcuMlwiLFxyXG4gICAgXCJkYXlqc1wiOiBcIl4xLjExLjExXCIsXHJcbiAgICBcImVjaGFydHNcIjogXCJeNS41LjFcIixcclxuICAgIFwiZWNoYXJ0cy1saXF1aWRmaWxsXCI6IFwiXjMuMS4wXCIsXHJcbiAgICBcImVjaGFydHMtd29yZGNsb3VkXCI6IFwiXjIuMS4wXCIsXHJcbiAgICBcImVsZW1lbnQtcGx1c1wiOiBcIl4yLjguMFwiLFxyXG4gICAgXCJpbnRlcnNlY3Rpb24tb2JzZXJ2ZXJcIjogXCJeMC4xMi4yXCIsXHJcbiAgICBcIm1hcmttYXAtbGliXCI6IFwiXjAuMTguMTJcIixcclxuICAgIFwibWFya21hcC12aWV3XCI6IFwiXjAuMTguMTJcIixcclxuICAgIFwibWQ1XCI6IFwiXjIuMy4wXCIsXHJcbiAgICBcIm1pdHRcIjogXCJeMy4wLjFcIixcclxuICAgIFwibnByb2dyZXNzXCI6IFwiXjAuMi4wXCIsXHJcbiAgICBcInBpbmlhXCI6IFwiXjIuMS43XCIsXHJcbiAgICBcInBpbmlhLXBsdWdpbi1wZXJzaXN0ZWRzdGF0ZVwiOiBcIl4zLjIuMVwiLFxyXG4gICAgXCJxc1wiOiBcIl42LjEyLjNcIixcclxuICAgIFwidnVlLWkxOG5cIjogXCJeOS4xMC4xXCIsXHJcbiAgICBcInZ1ZVwiOiBcIl4zLjQuMzFcIixcclxuICAgIFwidnVlLWRlbWlcIjogXCIwLjE0LjZcIixcclxuICAgIFwidnVlLXJvdXRlclwiOiBcIl40LjQuMFwiXHJcbiAgfSxcclxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBjb21taXRsaW50L2NsaVwiOiBcIl4xOC42LjFcIixcclxuICAgIFwiQGNvbW1pdGxpbnQvY29uZmlnLWNvbnZlbnRpb25hbFwiOiBcIl4xOC42LjNcIixcclxuICAgIFwiQHR5cGVzL21kNVwiOiBcIl4yLjMuNVwiLFxyXG4gICAgXCJAdHlwZXMvbnByb2dyZXNzXCI6IFwiXjAuMi4zXCIsXHJcbiAgICBcIkB0eXBlcy9xc1wiOiBcIl42LjkuMTVcIixcclxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeNy4xNi4xXCIsXHJcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeNy4xNi4xXCIsXHJcbiAgICBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiOiBcIl41LjAuNVwiLFxyXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI6IFwiXjMuMS4wXCIsXHJcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjE5XCIsXHJcbiAgICBcImN6LWdpdFwiOiBcIjEuOS4wXCIsXHJcbiAgICBcImN6Z1wiOiBcIl4xLjkuM1wiLFxyXG4gICAgXCJlc2xpbnRcIjogXCJeOC41Ny4wXCIsXHJcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOS4xLjBcIixcclxuICAgIFwiZXNsaW50LXBsdWdpbi1pbXBvcnRcIjogXCJeMi4yOS4xXCIsXHJcbiAgICBcImVzbGludC1wbHVnaW4tcHJldHRpZXJcIjogXCJeNS4xLjNcIixcclxuICAgIFwiZXNsaW50LXBsdWdpbi12dWVcIjogXCJeOS4yNy4wXCIsXHJcbiAgICBcImh1c2t5XCI6IFwiXjkuMC4xMVwiLFxyXG4gICAgXCJsaW50LXN0YWdlZFwiOiBcIl4xNS4yLjdcIixcclxuICAgIFwicG9zdGNzc1wiOiBcIl44LjQuMzlcIixcclxuICAgIFwicG9zdGNzcy1odG1sXCI6IFwiXjEuNy4wXCIsXHJcbiAgICBcInByZXR0aWVyXCI6IFwiXjMuMy4zXCIsXHJcbiAgICBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiOiBcIl41LjEyLjBcIixcclxuICAgIFwic2Fzc1wiOiBcIl4xLjc3LjhcIixcclxuICAgIFwic2hhcnBcIjogXCJeMC4zMy40XCIsXHJcbiAgICBcInN0YW5kYXJkLXZlcnNpb25cIjogXCJeOS41LjBcIixcclxuICAgIFwic3R5bGVsaW50XCI6IFwiXjE2LjcuMFwiLFxyXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLWh0bWxcIjogXCJeMS4xLjBcIixcclxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNlc3Mtb3JkZXJcIjogXCJeNS4wLjFcIixcclxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNvbW1lbmRlZC1zY3NzXCI6IFwiXjE0LjEuMFwiLFxyXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXJlY29tbWVuZGVkLXZ1ZVwiOiBcIl4xLjUuMFwiLFxyXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXN0YW5kYXJkXCI6IFwiXjM2LjAuMVwiLFxyXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXN0YW5kYXJkLXNjc3NcIjogXCJeMTMuMS4wXCIsXHJcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS41LjNcIixcclxuICAgIFwidW5wbHVnaW4tdnVlLXNldHVwLWV4dGVuZC1wbHVzXCI6IFwiXjEuMC4xXCIsXHJcbiAgICBcInZpdGVcIjogXCJeNS4zLjRcIixcclxuICAgIFwidml0ZS1wbHVnaW4tY29tcHJlc3Npb25cIjogXCJeMC41LjFcIixcclxuICAgIFwidml0ZS1wbHVnaW4tZXNsaW50XCI6IFwiXjEuOC4xXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWh0bWxcIjogXCJeMy4yLjJcIixcclxuICAgIFwidml0ZS1wbHVnaW4taW1hZ2Utb3B0aW1pemVyXCI6IFwiXjEuMS44XCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLXB3YVwiOiBcIl4wLjE3LjVcIixcclxuICAgIFwidml0ZS1wbHVnaW4tc3ZnLWljb25zXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcInZ1ZS10c2NcIjogXCJeMi4wLjI5XCJcclxuICB9LFxyXG4gIFwiZW5naW5lc1wiOiB7XHJcbiAgICBcIm5vZGVcIjogXCI+PTE2LjAuMFwiXHJcbiAgfSxcclxuICBcImJyb3dzZXJzbGlzdFwiOiB7XHJcbiAgICBcInByb2R1Y3Rpb25cIjogW1xyXG4gICAgICBcIj4gMSVcIixcclxuICAgICAgXCJub3QgZGVhZFwiLFxyXG4gICAgICBcIm5vdCBvcF9taW5pIGFsbFwiXHJcbiAgICBdLFxyXG4gICAgXCJkZXZlbG9wbWVudFwiOiBbXHJcbiAgICAgIFwibGFzdCAxIGNocm9tZSB2ZXJzaW9uXCIsXHJcbiAgICAgIFwibGFzdCAxIGZpcmVmb3ggdmVyc2lvblwiLFxyXG4gICAgICBcImxhc3QgMSBzYWZhcmkgdmVyc2lvblwiXHJcbiAgICBdXHJcbiAgfSxcclxuICBcImNvbmZpZ1wiOiB7XHJcbiAgICBcImNvbW1pdGl6ZW5cIjoge1xyXG4gICAgICBcInBhdGhcIjogXCJub2RlX21vZHVsZXMvY3otZ2l0XCJcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUyxTQUFTLGNBQWMsZUFBc0M7QUFDdlcsU0FBUyxXQUFBQSxnQkFBZTs7O0FDcUJqQixTQUFTLFdBQVcsU0FBOEI7QUFDdkQsUUFBTSxNQUFXLENBQUM7QUFFbEIsYUFBVyxXQUFXLE9BQU8sS0FBSyxPQUFPLEdBQUc7QUFDMUMsUUFBSSxXQUFXLFFBQVEsT0FBTyxFQUFFLFFBQVEsUUFBUSxJQUFJO0FBQ3BELGVBQVcsYUFBYSxTQUFTLE9BQU8sYUFBYSxVQUFVLFFBQVE7QUFDdkUsUUFBSSxZQUFZLFlBQWEsWUFBVyxPQUFPLFFBQVE7QUFDdkQsUUFBSSxZQUFZLGNBQWM7QUFDNUIsVUFBSTtBQUNGLG1CQUFXLEtBQUssTUFBTSxRQUFRO0FBQUEsTUFDaEMsU0FBUyxPQUFPO0FBQUEsTUFBQztBQUFBLElBQ25CO0FBQ0EsUUFBSSxPQUFPLElBQUk7QUFBQSxFQUNqQjtBQUNBLFNBQU87QUFDVDs7O0FDekJPLFNBQVMsWUFBWSxPQUFrQixDQUFDLEdBQUc7QUFDaEQsUUFBTSxNQUF1QixDQUFDO0FBQzlCLGFBQVcsQ0FBQyxRQUFRLE1BQU0sS0FBSyxNQUFNO0FBQ25DLFVBQU0sVUFBVTtBQUNoQixVQUFNLFVBQVUsUUFBUSxLQUFLLE1BQU07QUFHbkMsUUFBSSxNQUFNLElBQUk7QUFBQSxNQUNaO0FBQUEsTUFDQSxjQUFjO0FBQUEsTUFDZCxJQUFJO0FBQUEsTUFDSixTQUFTLFVBQVEsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLE1BQU0sRUFBRSxHQUFHLEVBQUU7QUFBQTtBQUFBLE1BRTFELEdBQUksVUFBVSxFQUFFLFFBQVEsTUFBTSxJQUFJLENBQUM7QUFBQSxJQUNyQztBQUFBLEVBQ0Y7QUFDQSxTQUFPO0FBQ1Q7OztBQzdCc1QsU0FBUyxlQUFlO0FBRTlVLFNBQVMsZUFBZTtBQUN4QixTQUFTLHdCQUF3QjtBQUNqQyxTQUFTLGtCQUFrQjtBQUMzQixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBRW5CLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8sb0JBQW9CO0FBTXBCLElBQU0sb0JBQW9CLENBQUMsWUFBd0Q7QUFDeEYsUUFBTSxFQUFFLHFCQUFxQixhQUFhLFNBQVMsSUFBSTtBQUN2RCxTQUFPO0FBQUEsSUFDTCxJQUFJO0FBQUE7QUFBQSxJQUVKLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlQLGVBQWUsQ0FBQyxDQUFDO0FBQUE7QUFBQSxJQUVqQixrQkFBa0IsT0FBTztBQUFBO0FBQUEsSUFFekIsaUJBQWlCO0FBQUEsTUFDZixRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUEsUUFDTixNQUFNLEVBQUUsT0FBTyxvQkFBb0I7QUFBQSxNQUNyQztBQUFBLElBQ0YsQ0FBQztBQUFBO0FBQUEsSUFFRCxxQkFBcUI7QUFBQSxNQUNuQixVQUFVLENBQUMsUUFBUSxRQUFRLElBQUksR0FBRyxrQkFBa0IsQ0FBQztBQUFBLE1BQ3JELFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQTtBQUFBLElBRUQsWUFBWSxjQUFjLE9BQU87QUFBQTtBQUFBLElBRWpDLGVBQWdCLFdBQVcsRUFBRSxVQUFVLGNBQWMsVUFBVSxNQUFNLFlBQVksS0FBSyxDQUFDO0FBQUEsRUFDekY7QUFDRjtBQU1BLElBQU0sb0JBQW9CLENBQUMsWUFBb0Q7QUFDN0UsUUFBTSxFQUFFLHNCQUFzQixRQUFRLHVDQUF1QyxJQUFJO0FBQ2pGLFFBQU0sZUFBZSxvQkFBb0IsTUFBTSxHQUFHO0FBQ2xELFFBQU0sVUFBMEIsQ0FBQztBQUNqQyxNQUFJLGFBQWEsU0FBUyxNQUFNLEdBQUc7QUFDakMsWUFBUTtBQUFBLE1BQ04sZ0JBQWdCO0FBQUEsUUFDZCxLQUFLO0FBQUEsUUFDTCxXQUFXO0FBQUEsUUFDWCxrQkFBa0I7QUFBQSxNQUNwQixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFDQSxNQUFJLGFBQWEsU0FBUyxRQUFRLEdBQUc7QUFDbkMsWUFBUTtBQUFBLE1BQ04sZ0JBQWdCO0FBQUEsUUFDZCxLQUFLO0FBQUEsUUFDTCxXQUFXO0FBQUEsUUFDWCxrQkFBa0I7QUFBQSxNQUNwQixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFDQSxTQUFPO0FBQ1Q7QUFNQSxJQUFNLGdCQUFnQixDQUFDLFlBQW9EO0FBQ3pFLFFBQU0sRUFBRSxvQkFBb0IsSUFBSTtBQUNoQyxTQUFPLFFBQVE7QUFBQSxJQUNiLGNBQWM7QUFBQSxJQUNkLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxNQUNULGNBQWMsQ0FBQztBQUFBLE1BQ2Ysa0JBQWtCO0FBQUEsTUFDbEIsZ0JBQWdCO0FBQUEsUUFDZDtBQUFBLFVBQ0UsWUFBWTtBQUFBLFVBQ1osU0FBUztBQUFBLFVBQ1QsU0FBUztBQUFBLFlBQ1AsV0FBVztBQUFBLFlBQ1gsWUFBWTtBQUFBO0FBQUEsY0FFVixZQUFZO0FBQUEsWUFDZDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDQTtBQUFBLFVBQ0UsWUFBWTtBQUFBLFVBQ1osU0FBUztBQUFBLFVBQ1QsU0FBUztBQUFBLFlBQ1AsV0FBVztBQUFBLFlBQ1gsWUFBWTtBQUFBLGNBQ1YsWUFBWTtBQUFBO0FBQUEsY0FDWixlQUFlLEtBQUssS0FBSyxLQUFLO0FBQUEsWUFDaEM7QUFBQSxZQUNBLG1CQUFtQjtBQUFBLGNBQ2pCLFVBQVUsQ0FBQyxHQUFHO0FBQUEsWUFDaEI7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFlBQVk7QUFBQSxVQUNaLFNBQVM7QUFBQSxVQUNULFNBQVM7QUFBQSxZQUNQLFdBQVc7QUFBQSxZQUNYLFlBQVk7QUFBQSxjQUNWLFlBQVk7QUFBQSxjQUNaLGVBQWUsS0FBSyxLQUFLLEtBQUs7QUFBQSxZQUNoQztBQUFBLFlBQ0EsbUJBQW1CO0FBQUEsY0FDakIsVUFBVSxDQUFDLEdBQUc7QUFBQSxZQUNoQjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDQTtBQUFBLFVBQ0UsWUFBWTtBQUFBLFVBQ1osU0FBUztBQUFBLFVBQ1QsU0FBUztBQUFBLFlBQ1AsV0FBVztBQUFBLFlBQ1gsWUFBWTtBQUFBLGNBQ1YsWUFBWTtBQUFBLGNBQ1osZUFBZSxLQUFLLEtBQUssS0FBSztBQUFBLFlBQ2hDO0FBQUEsWUFDQSxtQkFBbUI7QUFBQSxjQUNqQixVQUFVLENBQUMsR0FBRztBQUFBLFlBQ2hCO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1IsTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osYUFBYTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLEtBQUs7QUFBQSxVQUNMLE9BQU87QUFBQSxVQUNQLE1BQU07QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsT0FBTztBQUFBLFVBQ1AsTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBQ0g7OztBQ3ZLQTtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsYUFBZTtBQUFBLEVBQ2YsU0FBVztBQUFBLElBQ1QsS0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLElBQ2IsYUFBYTtBQUFBLElBQ2IsY0FBYztBQUFBLElBQ2QsU0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLElBQ2YsaUJBQWlCO0FBQUEsSUFDakIsa0JBQWtCO0FBQUEsSUFDbEIsb0JBQW9CO0FBQUEsSUFDcEIsU0FBVztBQUFBLElBQ1gsU0FBVztBQUFBLElBQ1gsUUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBLGNBQWdCO0FBQUEsSUFDZCwyQkFBMkI7QUFBQSxJQUMzQixnQkFBZ0I7QUFBQSxJQUNoQixzQkFBc0I7QUFBQSxJQUN0Qiw4QkFBOEI7QUFBQSxJQUM5QixPQUFTO0FBQUEsSUFDVCxPQUFTO0FBQUEsSUFDVCxTQUFXO0FBQUEsSUFDWCxzQkFBc0I7QUFBQSxJQUN0QixxQkFBcUI7QUFBQSxJQUNyQixnQkFBZ0I7QUFBQSxJQUNoQix5QkFBeUI7QUFBQSxJQUN6QixlQUFlO0FBQUEsSUFDZixnQkFBZ0I7QUFBQSxJQUNoQixLQUFPO0FBQUEsSUFDUCxNQUFRO0FBQUEsSUFDUixXQUFhO0FBQUEsSUFDYixPQUFTO0FBQUEsSUFDVCwrQkFBK0I7QUFBQSxJQUMvQixJQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixLQUFPO0FBQUEsSUFDUCxZQUFZO0FBQUEsSUFDWixjQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCLG1CQUFtQjtBQUFBLElBQ25CLG1DQUFtQztBQUFBLElBQ25DLGNBQWM7QUFBQSxJQUNkLG9CQUFvQjtBQUFBLElBQ3BCLGFBQWE7QUFBQSxJQUNiLG9DQUFvQztBQUFBLElBQ3BDLDZCQUE2QjtBQUFBLElBQzdCLHNCQUFzQjtBQUFBLElBQ3RCLDBCQUEwQjtBQUFBLElBQzFCLGNBQWdCO0FBQUEsSUFDaEIsVUFBVTtBQUFBLElBQ1YsS0FBTztBQUFBLElBQ1AsUUFBVTtBQUFBLElBQ1YsMEJBQTBCO0FBQUEsSUFDMUIsd0JBQXdCO0FBQUEsSUFDeEIsMEJBQTBCO0FBQUEsSUFDMUIscUJBQXFCO0FBQUEsSUFDckIsT0FBUztBQUFBLElBQ1QsZUFBZTtBQUFBLElBQ2YsU0FBVztBQUFBLElBQ1gsZ0JBQWdCO0FBQUEsSUFDaEIsVUFBWTtBQUFBLElBQ1osNEJBQTRCO0FBQUEsSUFDNUIsTUFBUTtBQUFBLElBQ1IsT0FBUztBQUFBLElBQ1Qsb0JBQW9CO0FBQUEsSUFDcEIsV0FBYTtBQUFBLElBQ2IseUJBQXlCO0FBQUEsSUFDekIsaUNBQWlDO0FBQUEsSUFDakMscUNBQXFDO0FBQUEsSUFDckMsb0NBQW9DO0FBQUEsSUFDcEMsNkJBQTZCO0FBQUEsSUFDN0Isa0NBQWtDO0FBQUEsSUFDbEMsWUFBYztBQUFBLElBQ2Qsa0NBQWtDO0FBQUEsSUFDbEMsTUFBUTtBQUFBLElBQ1IsMkJBQTJCO0FBQUEsSUFDM0Isc0JBQXNCO0FBQUEsSUFDdEIsb0JBQW9CO0FBQUEsSUFDcEIsK0JBQStCO0FBQUEsSUFDL0IsbUJBQW1CO0FBQUEsSUFDbkIseUJBQXlCO0FBQUEsSUFDekIsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULE1BQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxjQUFnQjtBQUFBLElBQ2QsWUFBYztBQUFBLE1BQ1o7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUNBLGFBQWU7QUFBQSxNQUNiO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBVTtBQUFBLElBQ1IsWUFBYztBQUFBLE1BQ1osTUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQ0Y7OztBSnhHQSxPQUFPLFdBQVc7QUFDbEIsU0FBUywwQkFBMEI7QUFQbkMsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTSxFQUFFLGNBQWMsaUJBQWlCLE1BQU0sUUFBUSxJQUFJO0FBQ3pELElBQU0sZUFBZTtBQUFBLEVBQ25CLEtBQUssRUFBRSxjQUFjLGlCQUFpQixNQUFNLFFBQVE7QUFBQSxFQUNwRCxlQUFlLE1BQU0sRUFBRSxPQUFPLHFCQUFxQjtBQUNyRDtBQUdBLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUE2QjtBQUMvRCxRQUFNLE9BQU8sUUFBUSxJQUFJO0FBQ3pCLFFBQU0sTUFBTSxRQUFRLE1BQU0sSUFBSTtBQUM5QixRQUFNLFVBQVUsV0FBVyxHQUFHO0FBRTlCLFNBQU87QUFBQSxJQUNMLE1BQU0sUUFBUTtBQUFBLElBQ2Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUtDLFNBQVEsa0NBQVcsT0FBTztBQUFBLFFBQy9CLFlBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sY0FBYyxLQUFLLFVBQVUsWUFBWTtBQUFBLElBQzNDO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixxQkFBcUIsQ0FBQyxpQkFBaUIsUUFBUTtBQUFBLFVBQy9DLEtBQUs7QUFBQSxVQUNMLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU0sUUFBUTtBQUFBLE1BQ2QsTUFBTSxRQUFRO0FBQUEsTUFDZCxNQUFNO0FBQUE7QUFBQSxNQUVOLE9BQU8sWUFBWSxRQUFRLFVBQVU7QUFBQSxJQUN2QztBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsR0FBRyxrQkFBa0IsT0FBTztBQUFBLE1BQzVCLG1CQUFtQjtBQUFBLFFBQ2pCLEtBQUs7QUFBQTtBQUFBLFVBRUgsVUFBVTtBQUFBO0FBQUEsVUFFVixTQUFTO0FBQUE7QUFBQSxZQUVQLFNBQVM7QUFBQSxjQUNQLEVBQUUsTUFBTSxrQkFBa0IsUUFBUSxFQUFFLFdBQVcsRUFBRSxlQUFlLE1BQU0sRUFBRSxFQUFFO0FBQUEsY0FDMUU7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDQSxLQUFLO0FBQUEsVUFDSCxTQUFTO0FBQUEsUUFDWDtBQUFBLFFBQ0EsTUFBTTtBQUFBLFVBQ0osU0FBUztBQUFBLFFBQ1g7QUFBQSxRQUNBLEtBQUs7QUFBQSxVQUNILFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsTUFBTSxRQUFRLG9CQUFvQixDQUFDLGVBQWUsVUFBVSxJQUFJLENBQUM7QUFBQSxJQUNuRTtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVNSLFdBQVc7QUFBQTtBQUFBLE1BRVgsc0JBQXNCO0FBQUE7QUFBQSxNQUV0Qix1QkFBdUI7QUFBQSxNQUN2QixlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUE7QUFBQSxVQUVOLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicmVzb2x2ZSIsICJyZXNvbHZlIl0KfQo=
