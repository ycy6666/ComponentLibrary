
import React, { useContext } from 'react';
import { Icolumn } from '../types';
import { Context } from '../index';
import { formatDate } from '../utils';
interface Iprops {
    columns: Array<Icolumn>,
    type: string
}

const renderNumber = (n, digists) => {
    if (n) {
        n = Number(n).toFixed(digists)
        n.indexOf('.') !== -1
        ? n.replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => `${$1},`)
        : n.replace(/(\d)(?=(\d{3}))/g, ($0, $1) => `${$1},`);
    }
    return n || '--';
}

const renderDate = (date, format = 'YYYY-mm-dd') => {
    return formatDate(new Date(date), format);
}
/**
 * 
 * @param area 被选中区
 * @param order 行序号（存在datasource的值）
 * @param columnOrder 列序号
 */
const calcChecked = (type,columns,area, order, columnDataIndex) => {
    if (area.start && area.end && type !== 'fixed') {
        const { start, end } = area;
        start.columnOrder = columns.findIndex(v=>v.dataIndex === start.columnDataIndex);
        end.columnOrder = columns.findIndex(v=>v.dataIndex === end.columnDataIndex);
        const columnOrder = columns.findIndex(v=>v.dataIndex === columnDataIndex);
        if (order < Math.min(start.order, end.order)) {
            return false
        }
        if (order > Math.max(start.order, end.order)) {
            return false
        }
        if (columnOrder < Math.min(start.columnOrder, end.columnOrder)) {
            return false
        }
        if (columnOrder > Math.max(start.columnOrder, end.columnOrder)) {
            return false
        }
        return true
    }
    return false
}
const Body: React.FC<Iprops> = (props: Iprops) => {

    const { columns, type } = props;
    const { state, dispatch } = useContext(Context);
    const { dataSource, drawRowStart, drawRowNumbers } = state;
    const drawDataSource = dataSource.slice(drawRowStart, drawRowStart + drawRowNumbers);

    const onMouseDown = (e) => {
        const { order, columndataindex } = e.currentTarget.dataset;
        if (e.button === 0) {  //只响应左键
            dispatch({ type: 'initCellAreaChecked', data: { order, columnDataIndex: columndataindex } })
        }
    }
    const onMouseOver = (e) => {
        if (state.cellAreaChecked.isChecking) {
            const { order, columndataindex } = e.currentTarget.dataset;
            dispatch({ type: 'changeCellAreaChecked', data: { end:{order, columnDataIndex: columndataindex }} })
        }
    }
    const onMouseUp = () => {
        dispatch({ type: 'endCellAreaChecked', data: '' })
    }
    const handleContextMenu = (e, column, item) => {
        const { clientX, clientY } = e;
        e.preventDefault();
        dispatch({
            type: 'handleContextMenu',
            data: {
                visible: true,
                event: { clientX, clientY },
                column: column,
                rowOrder: item.order
            }
        })
    }

    const handleClick = (order)=>{
        if(type === 'fixed'){
            dispatch({ 
                type: 'changeCellAreaChecked', 
                data: {
                    start:{order, columnDataIndex: 'order'},
                    end:{order, columnDataIndex: state.columns[state.columns.length - 1].dataIndex },

                }
            })
        }
    }

    //渲染单元格 优先级 column render参数 > custom 不变化 > number|date 定义了的类型 > 自动判断
    const createColRender = (item, column) => {
        const data = item[column.dataIndex];
        if (typeof column.render === 'function') {
            return column.render(data, item);
        }
        switch (column.columnType) {
            case 'custom': return data;  //如果
            case 'number': return renderNumber(data, column.digits || 2);
            case 'date': return renderDate(data, column.dateFormat || 'YYYY-mm-dd');
        }
        if (typeof data === 'number') {
            return renderNumber(data, column.digits || 2)
        }
        if (typeof data === 'object' && data instanceof Date) {
            return renderDate(data, column.dateFormat || 'YYYY-mm-dd');
        }
        return data || '--'
    }
    let  showColumns = [];
    if (type !== 'fixed') {
        const {columnsLeft = [], drawColumns } = state;
        const { start, end } = drawColumns;
        showColumns = columnsLeft.concat(columns.filter(v => v.fixed !== 'left').slice(start, end + 1));  //这里slice不对劲
    }
    else{
        showColumns = columns
    }
    return (
        <tbody className='edb-table-tbody'>
            {
                drawDataSource.map((item, i) => (
                    <tr style={{lineHeight:`${state.rowHeight - 9}px`}} className='edb-table-tr' key={`edb-table-tr-${i}`}>
                        {
                            showColumns.map((column, k) => {
                                return (
                                    <td className={`edb-table-td ${type==='fixed'?'edb-table-fixed-td':''} 
                                        ${calcChecked(type,state.columns,state.cellAreaChecked, item.order, column.dataIndex) ? 'cell-checked' : ''}`}
                                        key={`edb-table-td-${k}`}
                                        style={{textAlign:column.align?column.align:'left'}}
                                        data-order={item.order}
                                        data-columndataindex={column.dataIndex}   //用顺序而不是dataindex可能有缺陷
                                        onMouseDown={onMouseDown}
                                        onMouseOver={onMouseOver}
                                        onMouseUp={onMouseUp}
                                        //onDoubleClick={handleDoubleClick} 
                                        onClick={()=>handleClick(item.order)} 
                                        onContextMenu={(e) => handleContextMenu(e, column, item)}
                                    >
                                        {createColRender(item, column)}
                                    </td>
                                )
                            })
                        }
                    </tr>
                ))
            }
        </tbody>
    )

}

export default Body