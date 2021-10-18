import React, { useContext } from 'react';
import { Context } from './index';
import DropDown from './components/Dropdown';

interface Iprops {
}

export const ContextMenu: React.FC<Iprops> = () => {
    const { state, dispatch } = useContext(Context);

    const setCopyText = ()=>{
        const {columns,dataSource,cellAreaChecked:{start,end}} = state;
        let copyText = '';
        if(start && end){
            const startColumnOrder = columns.findIndex(v=>v.dataIndex === start.columnDataIndex)
            const endColumnOrder = columns.findIndex(v=>v.dataIndex === end.columnDataIndex)

            const startColumn = Math.min(startColumnOrder,endColumnOrder);
            const endColumn = Math.max(startColumnOrder,endColumnOrder);
            const startRow = Math.min(start.order,end.order);
            const endRow = Math.max(start.order,end.order);
            for(let i = startRow;i <= endRow;i++){
                for(let k = startColumn;k <= endColumn;k++){
                    copyText += dataSource[i - 1][columns[k].dataIndex] + '\t';
                }
                copyText += '\r\n';
            }
        }
        const Copy = document.createElement('textarea');
        Copy.value = copyText;
        document.body.appendChild(Copy);
        Copy.select();
        document.execCommand('Copy');
        document.body.removeChild(Copy);
    }
    const hideContextMenu = () => {
        if(state.dropDown.visible){
            dispatch({ type: 'hiddenContextMenu', data: null });
        }
    }
    const transpose=()=>{
        dispatch({type:'transpose',data:''})
    }
    const checkEnter = (e)=> {
        if (e.keyCode == 13) {
            hideContextMenu();
        }
    }

    const showEditCellInput=(e)=>{
        e.stopPropagation();
        dispatch({ type: 'showEditCellInput' })
    }

    const onEditCellInputClick = (e)=>{
          e.stopPropagation();
    }

    const onEditCellInputChange= (e)=>{
        e.stopPropagation()
        dispatch({ type: 'editCell', data: e.target.value })
    }

    const showDateFormatInput=(e)=>{
        e.stopPropagation();
        dispatch({ type: 'showDateFormatInput' })
    }

    const setDateType=(e)=>{
        dispatch({ type: 'setDateType', data: e.target.value })
    }
    
    const showDigitsInput = (e)=>{
        e.stopPropagation();
        dispatch({ type: 'showDigitsInput' })
    }

    const setDigits=(e)=>{
        dispatch({ type: 'setDigits', data: Number(e.target.value) })
    }

    const deleteRow=()=>{
        dispatch({ type: 'deleteRow' })
    }

    const deleteColumn=()=>{
        dispatch({ type: 'deleteColumn' })
    }

    return (
        <DropDown e={state.dropDown.event}>
            <div id="edb-table-contextmenu" className="edb-table-contextmenu" onClick={hideContextMenu}>
                <ul>
                    {
                        <li onClick={transpose}>旋转</li>
                    }
                    {
                        state.dropDown.rowOrder ? <li onClick={showEditCellInput}>编辑单元格</li> : null
                    }
                    {
                        state.dropDown.showEditCellInput ?<li><input defaultChecked
                            defaultValue={state.dataSource[state.dropDown.rowOrder - 1][state.dropDown.column.dataIndex]}
                            onClick={onEditCellInputClick}
                            onChange={onEditCellInputChange}
                            onKeyDown={checkEnter}></input></li>  : null
                    }
                    {
                        state.dropDown.column.columnType === 'date' ? <li onClick={showDateFormatInput}
                        >本列日期格式</li> : null
                    }
                    {
                        state.dropDown.showDateFormatInput ? <li><input defaultChecked defaultValue={state.dropDown.column.dateFormat || 'YYYY-mm-dd'}
                            onClick={(e) => e.stopPropagation()}
                            onChange={setDateType}
                            onKeyDown={checkEnter}></input></li> : null
                    }
                    {
                        state.dropDown.column.columnType === 'number' ? <li onClick={showDigitsInput}>本列小数点位数</li> : null
                    }
                    {
                        state.dropDown.showDigitsInput ? <li><input type='number' defaultChecked min={0} max={8} 
                            defaultValue={state.dropDown.column.digits || 2}
                            onClick={onEditCellInputClick}
                            onChange={setDigits}
                            onKeyDown={checkEnter}></input></li>  : null
                    }
                    {
                        state.dropDown.rowOrder ? <li onClick={deleteRow}>删除本行</li> : null
                    }
                    <li onClick={deleteColumn}>删除本列</li>
                    <li onClick={setCopyText}>复制选中</li>
                </ul>
            </div>
        </DropDown>
    )

}

export default ContextMenu