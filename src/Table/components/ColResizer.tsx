import React, { useContext } from 'react';
import { Context } from '../index';
import Draggle from './Draggable';
import { Icolumn } from '../types';

interface Iprops {
    column: Icolumn
}

const ColResizer: React.FC<Iprops> = (props: Iprops) => {

    const { column } = props;
    const { dispatch } = useContext(Context);

    const onResize = (e, data) => {
        const x = column.width as number + data.x;
        dispatch({ type: 'handleColResize', data: { x, column } })
    }
    return (
        <Draggle
            axis="x"
            position={{ x: 0, y: 0 }}
            onStop={onResize}
        >
            <span className="col-resizer">
            </span>
        </Draggle>)


}

export default ColResizer