
import React, { useState, useEffect, useReducer } from 'react';
import { Icolumn } from './types';
import BodyTable from './BodyTable';
import HeaderTable from './HeaderTable';
import FixedTable from './FixedTable';
import ScrollBar from './ScrollBar';
import ScrollBarBottom from './ScrollBarBottom';
import { defaultState, initState, reducer } from './reducer';
import ContextMenu from './ContextMenu';
import './style.less';

export interface IEDBTableProps {
    readonly rowHeight?: number,
    readonly height: number|string,
    readonly width: number,
    readonly scrollWithWholeColumn?:boolean, //是否整列滚动
    columns: Array<Icolumn>,
    dataSource: Array<Object>
}

export const Context = React.createContext(null);

const EDBTable: React.FC<IEDBTableProps> = (props: IEDBTableProps) => {
    const tableRef = React.useRef<HTMLDivElement>(null);

    const [initalState, setInitalState] = useState(initState(props, defaultState));

    const [state, dispatch] = useReducer(reducer, initalState);

    const hideContextMenu = () => {
        if (state.dropDown.visible) {
            dispatch({ type: 'hiddenContextMenu', data: null });
        }
    }
    useEffect(() => {
        const table = tableRef.current;
        const header = table.querySelector('.EDB-headertable-wrap');
        initalState.headHeight = header.clientHeight;
        initalState.realWidth = table.clientWidth;
        initalState.realHeight = table.clientHeight - header.clientHeight - 12; 
        const newState = initState(props, initalState);
        setInitalState(newState)  //每次props变化，通过dispatch重置state值，
        dispatch({ type: 'reset', data: newState })   //reduce里的数据创建后只能通过 dispatch更新 也就是初始化操作只有一次
    }, [props])

    const handleWheel = (e) => {
        const wheelType = e.nativeEvent.deltaY > 0 ? 1 : -1;
        dispatch({ type: 'handleWheel', data: wheelType })
    }

    const { width, height } = props;
    //console.log('index---', state)
    return (
        <Context.Provider value={{ state, dispatch }}>     {/*由context 和 reducer进行数据存储与变更操作 */}
            <div className="EDB-table-wrap" ref={tableRef} style={{ width, height, position: 'relative', overflow: 'hidden' }} onClick={hideContextMenu} onWheel={handleWheel}>
                <div style={{ width, height, overflowY: 'hidden', overflowX: 'hidden' }}> 
                    <HeaderTable columns={state.columns} type='normal' style={{marginLeft:state.marginLeft}}/>
                    <BodyTable columns={state.columns}  type='normal' style={{marginLeft:state.marginLeft}} />
                </div>
                {
                    state.columnsLeft.length ? (
                        <FixedTable columns={state.columnsLeft} direction="left" />
                    ) : null
                }
                {
                    state.columnsRight.length ? (
                        <FixedTable columns={state.columnsRight} direction="right" />
                    ) : null
                }
                {state.thumbHeight < state.realHeight ? <ScrollBar /> : null}
                {state.thumbBottomWidth < state.realWidth ? <ScrollBarBottom /> : null}
            </div>
            {
                state.dropDown && state.dropDown.visible && <ContextMenu />
            }
        </Context.Provider>
    )
}

export default EDBTable