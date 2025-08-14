import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import { resolve } from "path";
import { wrapperEnv } from "./build/getEnv";
import { createProxy } from "./build/proxy";
import { createVitePlugins } from "./build/plugins";
import pkg from "./package.json";
import dayjs from "dayjs";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import fs from "fs";
const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
};

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src")
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        scss: {
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
      }),
      {
        name: "write-version-file",
        generateBundle() {
          fs.writeFileSync("public/version.text", dayjs().format("YYYY-MM-DD HH:mm:ss"));
        }
      }
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
      chunkSizeWarningLimit: 2000,
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
