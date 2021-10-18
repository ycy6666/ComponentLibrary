
import React, { useContext,useRef } from 'react';
import { Context } from './index';
import Dragable from './components/Draggable';
import { debounce } from './utils';
interface Iprops {
}

const ScrollBar: React.FC<Iprops> = () => {

    const { state, dispatch } = useContext(Context);
    const handleDrag = debounce((_e, data) => {
        const y = data.y;
        dispatch({ type: 'calcDrawStart', data: y })
    }, 10);
    const myref = useRef(null);
    if(state.wheelType){
        myref.current.onMove(state.wheelType*5*(state.realHeight - state.thumbHeight)/state.dataSource.length);
        dispatch({ type: 'handleWheel', data: 0 })
    }
    return (
        <div className='scrollbar-wrap scrollbar-wrap-right' style={{ height: state.realHeight,top:state.headHeight}}>
            <Dragable
                bounds='parent'
                axis="y"
                onDrag={handleDrag}
                scale={1}
                ref = {myref} 
            >
                <div className='scrollbar-thumb scrollbar-thumb-right' style={{ height: state.thumbHeight }}>
                </div>
            </Dragable>
        </div>)



}

export default ScrollBar