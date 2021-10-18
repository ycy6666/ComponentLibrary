export const fetchColumns= ()=>{
    return  fetch(`http://localhost:3010/columns`, {
        method: "GET"
    }).then(result => {
        return result.json();
    }).catch(msg => {
        console.log(msg)
    });
 }

 export const fetchDataSource = ()=>{
    return  fetch(`http://localhost:3010/datasource`, {
        method: "GET"
    }).then(result => {
        return result.json();
    }).catch(msg => {
        console.log(msg)
    });
 }