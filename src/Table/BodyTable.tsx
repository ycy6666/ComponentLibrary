
import React from 'react';
import {Icolumn} from './types';
import Body from './components/Body';
import ColGroup from './components/ColGroup';
interface Iprops{
    columns: Array<Icolumn>,
    type: string,
    style?:any

}

const BodyTable:React.FC<Iprops> = (props:Iprops)=>{
    const {columns,type} = props;
    return (
        <div style={props.style?props.style:{}}  className="EDB-bodytable-wrap">
            <table className='EDB-table EDB-bodytable'>
                <ColGroup columns={columns} type={type}/>
                <Body columns={columns} type={type}/>
            </table>
        </div>
    )

}

export default BodyTable