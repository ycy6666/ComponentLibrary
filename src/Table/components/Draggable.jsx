import React from 'react';

//仿照 react-draggable的简单实现
class Draggable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragStart: 0,
            distance: 0,
            oldDistance: 0
        }
        this.img = new Image();
        this.img.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==";
    }
    //给滚动
    onMove = (x) => {
        let distance = x;
        const { oldDistance } = this.state;
        const { axis } = this.props;
        if (this.props.bounds === 'parent') {
            const parent = this.dom.parentNode;
            distance = Math.max(0 - oldDistance, distance);
            if (axis === 'x') {
                distance = Math.min(parent.clientWidth - oldDistance - this.dom.clientWidth, distance);
            }
            if (axis === 'y') {
                distance = Math.min(parent.clientHeight - oldDistance - this.dom.clientHeight, distance);
            }
        }
        this.setState({ oldDistance: distance + oldDistance })
        if (typeof this.props.onDrag === 'function') {
            this.props.onDrag(null, { x: oldDistance + distance, y: oldDistance + distance })
        }
    }
    onDrag = (e) => {
        let { dragStart, distance, oldDistance } = this.state;
        const { axis } = this.props;
        if (axis === 'x' && e.clientX !== 0) {
            distance = e.clientX - dragStart;
        }
        if (axis === 'y' && e.clientY !== 0) {
            distance = e.clientY - dragStart;
        }
        if (this.props.bounds === 'parent') {
            const parent = this.dom.parentNode;
            distance = Math.max(0 - oldDistance, distance);
            if (axis === 'x' && e.clientX !== 0) {
                distance = Math.min(parent.clientWidth - oldDistance - this.dom.clientWidth, distance);
            }
            if (axis === 'y' && e.clientY !== 0) {
                distance = Math.min(parent.clientHeight - oldDistance - this.dom.clientHeight, distance);
            }
        }
        if (typeof this.props.onDrag === 'function') {
            this.props.onDrag(e, { x: oldDistance + distance, y: oldDistance + distance })
        }
        this.setState({ distance })
    }
    onDragStart = (e) => {
        e.dataTransfer.setDragImage(this.img, 0, 0);
        e.dataTransfereffectAllowed = "move";
        const { axis } = this.props;
        if (axis === 'x') {
            this.setState({ dragStart: e.clientX })
        }
        if (axis === 'y') {
            this.setState({ dragStart: e.clientY })
        }
    }
    onDragEnd = (e) => {
        const { distance, oldDistance } = this.state;
        this.setState({ oldDistance: oldDistance + distance, distance: 0 });
        if (typeof this.props.onStop === 'function') {
            this.props.onStop(e, { x: oldDistance + distance, y: oldDistance + distance })
        }
        if (typeof this.props.position !== 'undefined') {
            this.setState({ oldDistance: 0, distance: 0 })
        }
    }
    createTranslate = () => {
        const { axis } = this.props;
        const { oldDistance, distance } = this.state;
        if (axis === 'x') {
            return `translateX(${distance + oldDistance}px)`
        }
        if (axis === 'y') {
            return `translateY(${distance + oldDistance}px)`
        }
    }
   
    renderChild = () => {
        return React.Children.map(this.props.children, child => {
            const style = child.props.style || {};
            return React.cloneElement(child, {
                draggable: true,
                onDrag: this.onDrag,
                onDragEnd: this.onDragEnd,
                onDragStart: this.onDragStart,
                ref: (e) => this.dom = e,
                style: { ...style, transform: this.createTranslate() }
            });
        });
    }
    render() {
        return (<React.Fragment>
            {this.renderChild()}
        </React.Fragment>
        )
    }
}
export default Draggable; 