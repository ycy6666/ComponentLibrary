interface IonSorter {
    (a: any, b: any): number
}
interface IonRender {
    (v: any, record: any): number
}
export interface IcontextMenu {
    visible: boolean//是否展示
    event: any, //右键时的鼠标事件定点部分属性截取
    column: Icolumn, //右键所在列
    rowOrder: number, //右键所在行,
    showEditCellInput: boolean, //展示单元格编辑框
    showDateFormat: boolean, //展示日期格式设置框
    showdigistFormat: boolean //展示小数位更改设置框
}

//鼠标滑动选取复数单元格
export interface IcellCheckStatus {
    isChecking: boolean  //是否在选取状态  由鼠标mousedown开始， mouseup结束
    start: {
        order: string //起点序号
        columnDataindex: string //起点列序号
    }
    end: {
        order: string //终点序号
        columnDataindex: string //终点点列序号
    }
}
export interface Icolumn {
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

export interface Istate {
    transpose: false,   //表格是否转置状态
    dataSource: Array<any>,
    columns: Array<Icolumn>,   //排序好的列
    columnsLeft: Array<Icolumn>, //左侧固定列
    columnsRight: Array<Icolumn>, //右侧固定列
    sortBy: string,
    desc: boolean,
    realWidth: number,
    realHeight: number,
    drawRowNumbers: number, //渲染个数
    drawRowStart: number, //渲染起始序号
    thumbHeight: number, //右边滑块高度
    thumbBottomWidth: number, //底部滑块宽度
    drawColumns: {start:number,end:number,distance:number}, //渲染的列起始，结束
    scrollWithWholeColumn: boolean, //是否整列滚动
    widthTotal: number,
    marginLeft: number, //左偏移，滚动效果
    dropDown: IcontextMenu,   //contextmenu相关信息
    cellAreaChecked: IcellCheckStatus,  //选中单元格相关信息
    copyText: string //复制选中的文本
}