import { createSort, createColumnsChangeFunction, transposeData,calcColumnStartAndEnd } from './utils';
import { Istate, Icolumn, IcontextMenu } from './types';
//这里可能不会写全 ，types里完整
export const defaultState = {
    transpose: false,
    columns: [],
    columnsLeft: [],
    columnsRight: [],
    realWidth: 400,
    realHeight: 400,
    drawRowStart: 0,
    scrollWithWholeColumn:false,
    dropDown: {
        event: { clientX: 0, clientY: 0 },
        visible: false
    },
    cellAreaChecked: {
        isChecking: false,
    }
}
/**
 * 
 * @param columnsOrigin 原始列
 * @return 加入序号 生成固定列，纵列
 */
const columnReset = function (columnsOrigin) {
    const columnOrder = {
        title: '序号',
        dataIndex: 'order',
        columnType: 'custom',
        fixed: 'left',
        sort: false,
        width: 60
    }
    //列排序处理
    const columnsLeft = [columnOrder], columnsRight = [];
    let  columns = [];
    columnsOrigin.forEach(column => {
        switch (column.fixed) {
            case 'left': columnsLeft.push(column); break;
            case 'right': columnsRight.push(column); break;
            default: columns.push(column); break;
        }
    })
    columns = [...columnsLeft, ...columns]
    return { columnsLeft, columns, columnsRight }
}
/**
 * 
 * @param props 传递给组件的参数
 * @param oldState 上一次的state数据
 */
export const initState = function (props, oldState) {
    const { columnsLeft, columns = [], columnsRight } = columnReset(props.columns);
    //渲染行数，列数处理,添加序号
    const { rowHeight = 28, dataSource } = props, { realWidth = 400, realHeight = 400, headHeight = 20 } = oldState;
    for(let i = 0; i < dataSource.length; i++){
        dataSource[i].order = i + 1;
    }
    const drawRowNumbers = Math.ceil(realHeight / (rowHeight));
    const thumbHeight = Math.max(20,realHeight * realHeight / (dataSource.length * rowHeight || 1));
    const noFixedFirst = columns.filter(v=>!v.fixed)[0];
    const thumbBottomWidth = Math.max(20,realWidth * realWidth / (
        columns.concat(columnsRight).reduce((m, n) => (m + n.width), 0) + (noFixedFirst?noFixedFirst.width:1)));  //加10是为了确保最后一列能完整显示
    const {start, end} = calcColumnStartAndEnd(0,columnsLeft,columns,realWidth);
    const widthTotal = columns.concat(columnsRight).reduce((m, n) => (m + n.width), noFixedFirst?noFixedFirst.width:1);
    return {
        ...oldState,
        ...props,
        drawRowNumbers,
        thumbHeight,
        headHeight,
        thumbBottomWidth,
        drawColumns:{start,end,distance:0},
        drawRowStart: 0,
        columns,  //排序好的列
        columnsLeft, //左侧固定列
        columnsRight, //右侧固定列
        marginLeft:0,
        widthTotal //列总宽度
    }
}

//点击表头排序
const sort = (state: Istate, column: Icolumn) => {
    let { desc,sortBy } = state;
    const {dataSource} = state;
    if (state.sortBy === column.dataIndex) {
        desc = !desc;
    }
    else {
        sortBy = column.dataIndex;
        desc = true;
    }
    if (typeof column.onSorter === 'function') {
        dataSource.sort(column.onSorter);
        if (desc) {
            dataSource.reverse();
        }
    }
    else {
        dataSource.sort(createSort(column.dataIndex, desc)) //默认排序方法
    }

    for (let i = 0; i < dataSource.length; i++) {
        dataSource[i].order = i + 1;
    }
    return { ...state, desc, dataSource:JSON.parse(JSON.stringify(dataSource)), sortBy }

}
//表头拖拽更改列宽
const handleColResize = (state: Istate, data: any) => {
    const { x, column } = data;
    const { columns, columnsLeft, columnsRight } = state;
    if (column.fixed === 'left') {
        for (let i = 0; i <= columnsLeft.length; i++) {
            if (columnsLeft[i].dataIndex === column.dataIndex) {
                columnsLeft[i].width = x;
                break;
            }
        }
    }
    if (column.fixed === 'right') {
        for (let i = 0; i <= columnsRight.length; i++) {
            if (columnsRight[i].dataIndex === column.dataIndex) {
                columnsRight[i].width = x;
                break;
            }
        }
    }
    for (let i = 0; i <= columns.length; i++) {
        if (columns[i].dataIndex === column.dataIndex) {
            columns[i].width = x;
            break;
        }
    }
    return { ...state, columns, columnsLeft, columnsRight }
}

//计算渲染起始行,实际渲染数组
const calcDrawStart = (state: Istate, y: number) => {
    let drawRowStart = Math.ceil(state.dataSource.length * y / (state.realHeight - state.thumbHeight));
    drawRowStart = Math.min(drawRowStart, state.dataSource.length - state.drawRowNumbers + 1);
    return { ...state, drawRowStart }
}

const calcDrawColumnStartWidth = (state: Istate, x: number) => {
    const widthTotal = state.widthTotal;
    const distance = x * (widthTotal - state.realWidth) / (state.realWidth - state.thumbBottomWidth);
    const { start, end, trip } = calcColumnStartAndEnd(distance, state.columnsLeft, state.columns, state.realWidth); //计算渲染起始列和结束列
    let marginLeft = state.marginLeft;
    if(!state.scrollWithWholeColumn){
        marginLeft = trip
    }
    return { ...state, drawColumns:{start,end,distance},marginLeft }
}
//右键点击事件
const handleContextMenu = (state: Istate, data: IcontextMenu) => {
    return { ...state, dropDown: data }
}

// close menu
const hiddenContextMenu = (state: Istate) => {
    return { ...state, dropDown: { visible: false } }
}
//重置数据
const reset = (state: Istate, newState: Istate) => {
    return { ...newState }
}

const deleteColumn = (state: Istate) => {
    let { columns, columnsLeft, columnsRight, dropDown: { column } } = state;
    columns = columns.filter(v => v.dataIndex !== column.dataIndex);
    columnsLeft = columnsLeft.filter(v => v.dataIndex !== column.dataIndex);
    columnsRight = columnsRight.filter(v => v.dataIndex !== column.dataIndex);

    const noFixedFirst = columns.filter(v=>!v.fixed)[0];
    const widthTotal = columns.concat(columnsRight).reduce((m, n) => (m + n.width), noFixedFirst?noFixedFirst.width:10);
    return { ...state, columns, columnsLeft, columnsRight,widthTotal }
}

const deleteRow = (state: Istate) => {
    let { dataSource, dropDown: { rowOrder } } = state;
    dataSource = dataSource.filter(v => v.order !== rowOrder)
    for (let i = 0; i < dataSource.length; i++) {
        dataSource[i].order = i + 1;
    }
    //const dataSourceNew = [...dataSource.filter(v => v.order !== rowOrder)];
    // for (let i = 0; i < dataSourceNew.length; i++) {
    //     dataSourceNew[i].order = i + 1;
    // }
    return { ...state, dataSource:JSON.parse(JSON.stringify(dataSource)) }
}

const handleColumnDrag = (state, data) => {
    const { columns } = state;
    const order1 = columns.findIndex(v => v.dataIndex === data.dataIndexDragged);
    const order2 = columns.findIndex(v => v.dataIndex === data.dataIndexDropped);
    if (order1 > - 1 && order2 > -1) {
        const temp = { ...columns[order1] }
        columns[order1] = { ...columns[order2] };
        columns[order2] = temp;
    }
    return { ...state, columns }
}

const showEditCellInput = (state) => {
    return { ...state, dropDown: { ...state.dropDown, showEditCellInput: true } }
}
const editCell = (state, newValue) => {
    const { column, rowOrder } = state.dropDown;
    const { dataSource } = state;
    const data = dataSource.find(v => v.order === rowOrder);
    if (data) {
        data[column.dataIndex] = newValue;
    }
    return { ...state, dataSource }

}

const showDateFormatInput = (state) => {
    return { ...state, dropDown: { ...state.dropDown, showDateFormatInput: true } }
}

const setDateType = createColumnsChangeFunction('dateFormat');

const showDigitsInput = (state) => {
    return { ...state, dropDown: { ...state.dropDown, showDigitsInput: true } }
}

const setDigits = createColumnsChangeFunction('digits');

const initCellAreaChecked = (state, data) => {
    const cellAreaChecked = {
        isChecking: true,
        start: data,
        end: data
    }
    return { ...state, cellAreaChecked }
}
const endCellAreaChecked = (state) => {
    const { cellAreaChecked } = state;
    cellAreaChecked.isChecking = false;
    return { ...state, cellAreaChecked }
}

const changeCellAreaChecked = (state, data) => {
    const { cellAreaChecked } = state;
    return { ...state, cellAreaChecked: { ...cellAreaChecked, ...data } }
}

/**
 * 
 * @param state 
 * @param data 
 */
const transpose = (state) => {
    if (!state.transpose) {
        const columnsBefore = [...state.columns, ...state.columnsRight || []];
        columnsBefore.shift();
        const { reColumns, reDataSource } = transposeData(columnsBefore, state.dataSource);
        //转置前数据存一下
        const objNotransposed = {
            columns: [...columnsBefore],
            dataSource: [...state.dataSource],
        }
        state.columns = reColumns;
        state.dataSource = reDataSource;
        return { ...initState(state, state), objNotransposed, transpose: true }
        //return {...state,transpose:true,dataSource:reDataSource,columns,columnsLeft,columnsRight,objNotransposed}
    }
    else {
        state.columns = state.objNotransposed.columns;
        state.dataSource = state.objNotransposed.dataSource;
        // const {dataSource,columns,columnsLeft,columnsRight} = state.objNotransposed;
        return { ...initState(state, state), transpose: false }
    }
}
const handleWheel = (state,wheelType) => {
    return { ...state,wheelType }
}
const actions = {
    reset,                //重置
    sort,                 //行排序
    calcDrawStart,        //上下滚动时计算渲染起始行
    calcDrawColumnStartWidth, //左右滑动计算实际划过距离
    handleColResize,      // 列宽调整
    handleContextMenu,   //显示右键菜单
    hiddenContextMenu,  //隐藏右键菜单
    deleteRow,          // 删除行
    deleteColumn,      //删除列
    handleColumnDrag,  //列拖拽排序  仅对非固定列有效
    showEditCellInput,    //显示单元格编辑框
    editCell,               //编辑单元格
    showDateFormatInput,  //显示日期格式修改input
    setDateType,   //更改列日期格式
    showDigitsInput,  //显示数字小数位数input
    setDigits, //设置选定列小数位，
    initCellAreaChecked, //鼠标摁下，初始化选中信息
    endCellAreaChecked,    //鼠标松开，结束选中信息更新（解除 mouseover事件）
    changeCellAreaChecked,  //鼠标移动，更新选中信息
    transpose,  //转置
    handleWheel,
}
//数据操作中心
export const reducer = (state, action) => {
    console.log('----action----',action.type)
    return actions[action.type](state, action.data);
}