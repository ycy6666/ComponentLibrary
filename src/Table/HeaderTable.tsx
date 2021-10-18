
import React from 'react';
import { Icolumn } from './types';
import Header from './components/Header';
import ColGroup from './components/ColGroup';

interface Iprops {
    className?: string,
    columns: Array<Icolumn>,
    type: string,
    style?:any
}

const HeaderTable: React.FC<Iprops> = (props: Iprops) => {
    const { columns, className, type } = props;

    return (
        <div style={props.style?props.style:{}} className={`EDB-table-wrap EDB-headertable-wrap ${className || ''}`}>
            <table className='EDB-table EDB-headertable'>
                <ColGroup columns={columns} type={type} />
                <Header columns={columns} type={type} />
            </table>
        </div>
    )

}

export default HeaderTable