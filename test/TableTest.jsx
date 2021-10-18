import React from 'react';
import {Table} from '../src/main';
import {fetchColumns, fetchDataSource} from './request';

class TableTest extends React.Component{
    state = {
        columns:[],
        dataSource:[],
        rowHeight: 28,
        height: 500,
        width:700,
        rowLength: 100000,
        scrollWithWholeColumn:false
    }
    componentDidMount = ()=>{
        Promise.all([fetchColumns(2),fetchDataSource()]).then((data)=>{
            this.setState({rowLength:data[1].length ,columns:data[0],dataSource:data[1]})
        })
    }
    changeColumns = (type)=>{
        fetchColumns(type).then(columns=>{
            this.setState({columns})
        })
    }
    changeRowHeight = (e)=>{
        this.setState({rowHeight:Number(e.target.value)})
    }
    changeWidth= (e)=>{
        this.setState({width:Number(e.target.value)})
    }
    changeHeight= (e)=>{
        this.setState({height:Number(e.target.value)})
    }
    changeRowLength= (e)=>{
        this.setState({rowLength:Number(e.target.value)})
    }
    render(){
        const {columns,dataSource,rowHeight,height,width,rowLength} = this.state;
        return (
            <div>
                <div>
                    <span>行高</span>
                    <input value={rowHeight} style={{width:'40px'}} type="number" onChange={this.changeRowHeight}></input>
                    <span style={{marginLeft:'20px'}}>宽度</span>
                    <input value={width} style={{width:'40px'}} type="number" step={50} onChange={this.changeWidth}></input>
                    <span style={{marginLeft:'20px'}}>高度</span>
                    <input value={height} style={{width:'40px'}} type="number" step={50} onChange={this.changeHeight}></input>
                    <span style={{marginLeft:'20px'}}>行数</span>
                    <input value={rowLength} style={{width:'60px'}} type="number" step={50} onChange={this.changeRowLength}></input>
                </div>
                <div style={{margin:'10px 0'}}>
                    <button style={{marginLeft:'20px'}} onClick={()=>this.changeColumns(2)}>默认</button>
                    <button style={{marginLeft:'20px'}} onClick={()=>this.changeColumns(1)}>加右侧固定列</button>
                </div>
                <div style={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap'}}>
                    <Table 
                        key={Math.random()}
                        columns={columns}
                        dataSource={dataSource.slice(0,rowLength)}
                        rowHeight={rowHeight}
                        height={height}
                        width={width}
                    />  
                    <div>
                        <div>整列滚动</div>
                        <div>
                            <Table 
                                key={Math.random()}
                                columns={columns}
                                scrollWithWholeColumn={true}
                                dataSource={dataSource.slice(0,rowLength)}
                                rowHeight={rowHeight}
                                height={height}
                                width={width}
                            /> 
                        </div>
                    </div>
                </div>
            </div>
           )
    }

}

export default TableTest

