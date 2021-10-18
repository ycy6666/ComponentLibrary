import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript2 from 'rollup-plugin-typescript2';
import babel from "rollup-plugin-babel";  //编译兼容
import less from 'rollup-plugin-less';
import { terser } from 'rollup-plugin-terser';  //压缩
import { eslint } from 'rollup-plugin-eslint';
import serve from 'rollup-plugin-serve';//换用webpack-dev-server
import livereload from 'rollup-plugin-livereload'; //换用webpack-dev-server

const env = process.env.NODE_ENV;  //当前环境
const isDev = (env === 'development');
const config =
{
    input: 'src/main.js',
    output: {
        name: 'train',
        file:  './dist/Table.js',
        format: 'esm',
        sourcemap: true
    },
    external: ['react','react-dom'],//依赖文件不打包
    plugins: [
        //eslint(),
        less(),
        resolve(),
        babel(),
        typescript2(),
        commonjs(),
        //livereload()
        // 本地服务器
        // serve({
        //     open: true, 
        //     port: 8000,
        //     contentBase: 'dist/'
        // })
    ]
}


// //开发环境补充node_modules内容
// if(env == "development"){
//     config.plugins.push(resolve())
// }
// //生产环境补充代码压缩
// else if(env == "production"){
//     config.plugins.push(terser())
// }
export default config;