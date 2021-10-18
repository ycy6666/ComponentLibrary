
import React from 'react';
import { Icolumn } from './types';
import BodyTable from './BodyTable';
import HeaderTable from './HeaderTable';

interface Iprops {
    columns: Array<Icolumn>,
    className?: string,
    direction?: 'left' | 'right'
}

const FixedTable: React.FC<Iprops> = (props: Iprops) => {
    const { columns, className, direction } = props;
    return (
        <div className={`EDB-fixedtable-wrap ${direction === 'left' ? 'EDB-fixedtable-left' : 'EDB-fixedtable-right'} ${className || ''}`}>
            <HeaderTable columns={columns} type='fixed' />
            <BodyTable columns={columns} type='fixed' />
        </div>
    )

}

export default FixedTable