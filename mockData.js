const faker  =  require('faker');
const lodash = require('lodash');

module.exports =  function(){
    return({
            "columns1":[
                {
                    "dataIndex": "name",
                    "title": "名称\n指标",
                    "fixed":"left",
                    "width":100
                },
                {
                    "dataIndex": "hight",
                    "title": "身高\n指标",
                    "width":100
                },
                {
                    "dataIndex": "update",
                    "title": "更新日期\n指标",
                    "columnType": 'date',
                    "dateFormat": 'YYYY-mm-dd',
                    "align": 'right',
                    "width":150
                },
                {
                    "dataIndex": "old",
                    "title": "年龄\n指标",
                    "width":100,
                    "columnType":"number",
                    "fixed":"right",
                    "digits":3
                },
                {
                    "dataIndex": "weight",
                    "title": "体重\n指标",
                    "align": 'center',
                    "width":100,
                    "columnType":"number",
                    "digits":1
                },
                {
                    "dataIndex": "birthday",
                    "title": "出生日期\n指标",
                    "columnType": 'date',
                    "dateFormat": 'YYYY-mm-dd',
                    "width":200
                },
                {
                    "dataIndex": "address",
                    "title": "地址\n指标",
                    "width":150
                },
                {
                    "dataIndex": "love",
                    "title": "爱好\n指标",
                    "width":150
                },
                {
                    "dataIndex": "money",
                    "title": "家产\n指标",
                    "columnType": 'number',
                    "width":150
                }
            ],
            "columns2":[
                {
                    "dataIndex": "name",
                    "title": "名称\n指标",
                    "fixed":"left",
                    "width":100
                },
                {
                    "dataIndex": "hight",
                    "title": "身高\n指标",
                    "width":100
                },
                {
                    "dataIndex": "update",
                    "title": "更新日期\n指标",
                    "columnType": 'date',
                    "dateFormat": 'YYYY-mm-dd',
                    "align": 'right',
                    "width":150
                },
                {
                    "dataIndex": "old",
                    "title": "年龄\n指标",
                    "width":100,
                    "columnType":"number",
                    "digits":3
                },
                {
                    "dataIndex": "weight",
                    "title": "体重\n指标",
                    "align": 'center',
                    "width":100,
                    "columnType":"number",
                    "digits":1
                },
                {
                    "dataIndex": "birthday",
                    "title": "出生日期\n指标",
                    "columnType": 'date',
                    "dateFormat": 'YYYY-mm-dd',
                    "width":200
                },
                {
                    "dataIndex": "address",
                    "title": "地址\n指标",
                    "width":150
                },
                {
                    "dataIndex": "love",
                    "title": "爱好\n指标",
                    "width":150
                },
                {
                    "dataIndex": "money",
                    "title": "家产\n指标",
                    "columnType": 'number',
                    "width":150
                }
            ],
            "columns3":[
                {
                    "dataIndex": "name",
                    "title": "名称",
                    "fixed":"left",
                    "width":100
                },
                {
                    "dataIndex": "hight",
                    "title": "身高\n指标",
                    "width":100
                },
                {
                    "dataIndex": "update",
                    "title": "更新日期",
                    "columnType": 'date',
                    "dateFormat": 'YYYY-mm-dd',
                    "align": 'right',
                    "width":150
                },
                {
                    "dataIndex": "old",
                    "title": "年龄",
                    "width":100,
                    "columnType":"number",
                    "digits":3
                },
                {
                    "dataIndex": "weight",
                    "title": "体重",
                    "align": 'center',
                    "width":100,
                    "columnType":"number",
                    "digits":1
                },
                {
                    "dataIndex": "birthday",
                    "title": "出生日期",
                    "columnType": 'date',
                    "dateFormat": 'YYYY-mm-dd',
                    "width":200
                },
                {
                    "dataIndex": "address",
                    "title": "地址",
                    "width":150
                },
                {
                    "dataIndex": "love",
                    "title": "爱好",
                    "width":150
                },
                {
                    "dataIndex": "money",
                    "title": "家产",
                    "columnType": 'number',
                    "width":150
                }
            ],
            "dataSource": lodash.times(10000,function(n){
                return ({
                    name: faker.name.findName(),
                    hight: lodash.random(1500,2000)/10,
                    update:faker.date.past(),
                    old: lodash.random(100,100000)/100,
                    address: faker.address.streetName(),
                    love: faker.name.findName(),
                    money: lodash.random(1000,100000),
                    birthday: faker.date.past(),
                    weight:lodash.random(100,10000)/15,
                })
            })
    })
}