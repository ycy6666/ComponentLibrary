import React, { useContext } from 'react';
import {Icolumn} from '../types';
import { Context } from '../index';
interface Iprops{
    columns: Array<Icolumn>,
    type:string
}

const ColGroup:React.FC<Iprops> = (props:Iprops)=>{
    let {columns=[],type} = props;
    const { state } = useContext(Context);
    if (type !== 'fixed') {
        const {columnsLeft = [], drawColumns } = state;
        const { start, end } = drawColumns;
        columns = columnsLeft.concat(columns.filter(v => v.fixed !== 'left').slice(start, end + 1));  //这里slice不对劲
    }
    const widthGroup = columns.map(column=>{return column.width||80})
    return (
       <colgroup>
       {
           widthGroup.map((width,i)=>(
               <col key={`${type}-${i}-${width}`} width={width}></col>
           ))
       }
       </colgroup>
    )

}

export default ColGroup