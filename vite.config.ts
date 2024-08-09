import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path, { resolve } from "path";

// 自动导入vue中hook reactive ref等
import AutoImport from "unplugin-auto-import/vite";
//自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from "unplugin-vue-components/vite";

import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  resolve: {
    // ↓路径别名
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  server: {
    port: 8990,
    proxy: {
      "/api/v1": {
        target: "https://mock.mengxuegu.com/mock/63218b5fb4c53348ed2bc212",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      //安装两行后你会发现在组件中不用再导入ref，reactive等
      imports: ["vue", "vue-router"],
      //存放的位置
      dts: "src/auto-import.d.ts"
    }),
    Components({
      // 引入组件的,包括自定义组件
      dts: "src/components.d.ts"
    }),
    //将 SVG 静态图转化为 Vue 组件
    svgLoader({ defaultImport: "url" }),
    //SVG
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
      symbolId: "icon-[dir]-[name]"
    })
  ],
  // 配置打包文件输出
  build: {
    outDir: "dist",
    // esbuild打包速度最快，terser打包体积最小。
    minify: "terser",
    // 小于该值 图片将打包成Base64
    // assetsInlineLimit: 4000,
    terserOptions: {
      compress: {
        //打包时删除console
        drop_console: true,
        //打包时删除 debugger
        drop_debugger: true,
        pure_funcs: ["console.log"]
      },
      output: {
        // 去掉注释内容
        comments: true
      }
    },
    // 禁用 gzip 压缩大小报告，可略微减少打包时间
    reportCompressedSize: false,
    // 规定触发警告的 chunk 大小
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // js最小拆包
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[1].toString();
          }
        },
        // 静态资源分类和包装
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    }
  }
});
