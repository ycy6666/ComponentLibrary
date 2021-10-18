
import React, { useContext } from 'react';
import { Context } from './index';
import Dragable from './components/Draggable';
import { debounce } from './utils';
interface Iprops {
}

const ScrollBarBottom: React.FC<Iprops> = () => {

    const { state, dispatch } = useContext(Context);
    const handleDrag = debounce((e, data) => {
        const x = data.x;
        dispatch({ type: 'calcDrawColumnStartWidth', data: x })
    }, 0)
    return (
        <div className='scrollbar-wrap scrollbar-wrap-bottom' style={{ width: state.realWidth }}>
            <Dragable
                bounds='parent'
                axis="x"
                onDrag={handleDrag}
                scale={1}
            >
                <div className='scrollbar-thumb scrollbar-thumb-bottom' style={{ width: state.thumbBottomWidth }}>
                </div>
            </Dragable>
        </div>)



}

export default ScrollBarBottom