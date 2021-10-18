function isChinese(a: any) {
    var reg = /[^\u4E00-\u9FA5]/;
    if (reg.test(a)) {
        return false;
    }
    return true;
}

/**
 * 创建sort方法
 * @param key 关键词
 * @param desc 是否降序
 * @return 排序函数
 */
export const createSort = function (key: string, desc: boolean) {
    const direction = desc ? -1 : 1;
    return function (a: any, b: any) {
        if (isChinese(a)) {
            return (a[key] as string).localeCompare(b[key]) * direction
        }
        else {
            return ((a[key] > b[key]) ? 1 : -1) * direction
        }
    }
}

/**
 * 防抖
 * @param fn 
 * @param wait 
 */
export const debounce = function (fn, wait = 100) {
    let run = null;
    return function (...args) {
        if (run) {
            clearTimeout(run);
        }
        run = setTimeout(() => {
            fn.apply(this, args)
        }, wait)
    }

}

export const formatDate = function (date: Date, format: string) {
    const opt = {
        "m+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "M+": date.getMinutes(),
        "S+": date.getSeconds()
    };
    if (/(Y+|y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (const key in opt) {
        const reg = new RegExp("(" + key + ")").test(format);
        if (reg) {
            format = format.replace(RegExp.$1,
                (RegExp.$1.length == 1) ? (opt[key]) : (("00" + opt[key]).substr(("" + opt[key]).length))
            );
        }
    }
    return format
}

/**
 * 创建表格列比找到当前选中列兵修改对应值的方法,一些列操作的柯里化处理
 * @param key 要修改值的关键字
 * @return Function
 */
export const createColumnsChangeFunction = function (key) {
    return (state, newValue) => {
        const { column } = state.dropDown;
        const { columns, columnsLeft, columnsRight } = state;
        if (column.fixed === 'left') {
            for (let i = 0; i < columnsLeft.length; i++) {
                if (columnsLeft[i].dataIndex === column.dataIndex) {
                    columnsLeft[i][key] = newValue;
                    break;
                }
            }
        }
        if (column.fixed === 'right') {
            for (let i = 0; i < columnsRight.length; i++) {
                if (columnsRight[i].dataIndex === column.dataIndex) {
                    columnsRight[i][key] = newValue;
                    break;
                }
            }
        }
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].dataIndex === column.dataIndex) {
                columns[i][key] = newValue;
                break;
            }
        }
        return { ...state, columns, columnsLeft, columnsRight }
    }
}

export const transposeData = (columns, dataSource) => {
    let reColumns = [];
    const reDataSource = [];
    if (columns.length) {
        reColumns = dataSource.map((item,i) => ({    //第一列转表头
            dataIndex: item[columns[0].dataIndex] + '' + i,
            width: 100,
            title: item[columns[0].dataIndex]
        }))
        reColumns.unshift({ //原第一列名保持
            dataIndex: '0',
            title: columns[0].title,
            fixed: 'left',
            width: 100  //转置的列宽统一置为100
        })
        for (let i = 1; i < columns.length; i++) {
            const item = {};
            item['0'] = columns[i].title;
            for (let k = 1; k < reColumns.length; k++) {
                item[reColumns[k].dataIndex] = dataSource[k - 1][columns[i].dataIndex]  //比较绕-
            }
            reDataSource.push(item)
        }
    }
    return { reColumns, reDataSource }
}

/**
* 计算起始列和最终列
*/
export const calcColumnStartAndEnd = function (x, columnsLeft=[], columns, realWidth) {
    const calcColumns = columns.slice(columnsLeft.length) //计算时排除掉左侧悬浮列；
    let start = 0, widthTotal = 0, end = 0;
    const columnsWidth = calcColumns.map(v => v.width);
    realWidth = realWidth - columnsLeft.reduce((m, n) => (m + n.width), 0);
    if (columnsWidth.reduce((m, n) => (m + n), 0) > realWidth) {
        widthTotal += columnsWidth[0];
        while (widthTotal < x && start < columnsWidth.length) {
            widthTotal += columnsWidth[++start];
        }
        end = start;
        let drawWidth = columnsWidth[start];
        while (drawWidth < realWidth && end < columnsWidth.length - 1) {
            ++end;
            drawWidth += columnsWidth[end];
        }
        end = Math.min(end+2,columnsWidth.length - 1)
        return { start, end, trip: widthTotal - x - columnsWidth[start]} // 偏移量 （等于滚动总长度 - 0到起始渲染列宽度（包括）） 与  起始渲染列宽度 差值
    }
    else return ({ start: 0, end: columnsWidth.length })
}
