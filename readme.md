**目录结构**

dist  ---生成组件库位置
output ---webpack 配置output位置
public  --- 开发模式静态资源位置
.babelrc  ----babel 各种编译上的兼容配置 仅用于webpack
.eslintrc   -----eslint 语法检查配置
tsconfig.json  ----- typescript配置文件 ，组件使用ts编写
src/
	main.js 组件中心
	Table 表格组件
test/
    index.html html模板
    index.jsx  用于测试的首页
rollup.config.js  ----rollup配置文件,仅用于打包组件
webpack.config.js   -----webpack配置文件，主要使用了webpack-dev-server进行调试
package.json   ----npm 配置文件

**script**
    "build": "set NODE_ENV=production && rollup -c", 用于运行rollup打包main.js为入口的组件文件 
    "start": "webpack-dev-server --inline"   用于开发调试， src/index.js里引用main.js中组件进行展示测试 

**interface**
IEDBTableProps {
    readonly rowHeight?: number,
    readonly height: number|string,
    readonly width: number,
    readonly scrollWithWholeColumn?:boolean, //是否整列滚动,默认false 横向滚动时，会有滚动效果
    columns: Array<Icolumn>,
    dataSource: Array<Object>
}

Icolumn {
    key?: string
    title: string
    dataIndex: string
    width?: number,
    fixed?: 'left' | 'right',
    columnType?: 'custom' | 'date' | 'number',
    align?:'left'|'center'|'right',
    sort?: boolean,
    onSorter?: IonSorter,
    onRender?: IonRender,
    digits: number //默认小数点位，只在columnType为number时生效，也可在该列右键设置
    dateFormat: string //默认日期格式，只在columnType为date生效，也可在该列右键设置
}