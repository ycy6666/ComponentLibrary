import React, { useEffect } from 'react';
import './style.less';
export interface Iprops {
    className?: string
    children: any,
    e: MouseEvent
}
const DropDwon: React.FC<Iprops> = (props: Iprops) => {
    const dropDownRef = React.useRef<HTMLDivElement>(null);

    const setStyle = (e) => {
        const current = dropDownRef.current;
        const { clientX, clientY } = e;
        const { clientWidth, clientHeight } = document.querySelector('body');
        const dropDownWidth = current.clientWidth;
        const dropDownHeight = current.clientHeight;

        const right = (clientWidth - clientX) > dropDownWidth  //优先在右下
        const bottom = (clientHeight - clientY) > dropDownHeight

        if (right) {
            current.style.left = `${clientX + 5}px`;
        }
        else {
            current.style.left = `${clientX - dropDownWidth - 5}px`;
        }
        if (bottom) {
            current.style.top = `${clientY + 5}px`;
        }
        else {
            current.style.top = `${clientY - dropDownHeight - 5}px`;
        }
        current.style.visibility = 'visible';
    }


    useEffect(() => {
        setStyle(props.e);
    }, [props])

    return (
        <div style={{visibility: 'hidden' }} ref={dropDownRef}  {...props} className={`dropdown ${props.className || ''}`}>
            {props.children}
        </div>
    )

}

export default DropDwon