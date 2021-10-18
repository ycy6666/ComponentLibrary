import React from 'react';
import ReactDOM from 'react-dom';
import {Table} from '../src/main';
import {fetchColumns, fetchDataSource} from './request';

Promise.all([fetchColumns(),fetchDataSource()]).then((data)=>{
    ReactDOM.render(
        <Table 
            columns={data[0]}
            dataSource={data[1]}
            rowHeight={28}
            height={500}
            width={600}
        /> ,
     document.getElementById('root'))
}).catch((data)=>{
    console.log('err',data)
})

