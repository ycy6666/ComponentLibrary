
import React, { useContext } from 'react';
import { Icolumn } from '../types';
import { Context } from '../index';
import ColResizer from './ColResizer';

interface Iprops {
    columns: Array<Icolumn>,
    type: string
}

const Header: React.FC<Iprops> = (props: Iprops) => {

    const { columns, type } = props;
    const { state, dispatch } = useContext(Context);

    //存储被拖动列信息
    const onDragStart = (e) => {
        e.dataTransfer.setData("column_drag", e.currentTarget.dataset.dataindex);
    }

    //允许放入
    const onDragOver = (e) => {
        e.preventDefault();
    }

    //放下时，拿取数据信息
    const onDrop = (e) => {
        e.preventDefault();
       
        const dataIndexDragged = e.dataTransfer.getData("column_drag");
        const dataIndexDropped = e.target.parentNode.dataset.dataindex;
        if (dataIndexDropped && !state.columns.find(v => v.dataIndex === dataIndexDropped).fixed) {
            dispatch({ type: 'handleColumnDrag', data: { dataIndexDragged, dataIndexDropped } })
        }
    }
    const handleContextMenu = (e, column) => {
        const { clientX, clientY } = e;
        e.preventDefault();
        dispatch({
            type: 'handleContextMenu',
            data: {
                visible: true,
                event: { clientX, clientY },
                column: column,
                rowOrder: 0
            }
        })
    }
    const sortAndSetChecked = (column) => {
        if (column.sort !== false) {
            dispatch({ type: 'sort', data: column });
        }
        dispatch({
            type: 'changeCellAreaChecked',
            data: {
                start: { order: 1, columnDataIndex: column.dataIndex },
                end: { order: state.dataSource.length, columnDataIndex: column.dataIndex },

            }
        })
    }

    const createSort = (column) => {
        if (state.sortBy === column.dataIndex) {
            if (state.desc) {
                return '↓'
            }
            else {
                return '↑'
            }
        }
        return ''
    }

    let showColumns = []
    if (type !== 'fixed') {
        const {columnsLeft = [], drawColumns } = state;
        const { start, end } = drawColumns;
        showColumns = columnsLeft.concat(columns.filter(v => v.fixed !== 'left').slice(start, end + 1));  //这里slice不对劲
    }
    else {
        showColumns = columns;
    }
    return (
        <thead>
            <tr  className='edb-table-th'>
                {
                    showColumns.map((column: Icolumn) => {
                        return (
                            <th key={`${type}-head-${column.dataIndex}`} className='edb-table-th'
                                data-dataindex={column.dataIndex}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                style={{textAlign:column.align?column.align:'left'}}
                                onContextMenu={(e) => handleContextMenu(e, column)}
                            >
                                <div
                                    data-dataindex={column.dataIndex}
                                    draggable={column.fixed ? false : true}
                                    onDragStart={onDragStart}
                                    onClick={() => sortAndSetChecked(column)}>
                                        {(`${column.title}${createSort(column)}`).split('\n').map(v=>(<div key={v}>{v}</div>))}
                                        {/* {column.title} */}
                                        {/* <span>{createSort(column)}</span> */}
                                </div>
                                <ColResizer column={column} />
                            </th>
                        )
                    })
                }
            </tr>
        </thead>)



}

export default Header