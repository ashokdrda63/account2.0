import axios from 'axios';

export const fetchTableMaqSeq = async (tableName) => {
    let response
    try {
        response = await axios.post('http://localhost:8000/get_seq', {
            table_name: tableName,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return (response.data[0].max_seq)
};

export const fetchMasterData = async (table) => {
    let result
    try {
        let response = await axios.post("http://localhost:8000/get_all", { table_name: table })
        result = response.data;
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return result;
}

export const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
}

export const sortFromTo = (array, key) => {
    return array.sort(function(a,b){
        var x = a[key]; var y=b[key];
        return((x<y)?-1:((x>y)?1:0));
    });
}

export const sortToFrom = (array, key) => {
    return array.sort(function(a,b){
        var x = a[key]; var y=b[key];
        return((x>y)?-1:((x>y)?1:0));
    });
}

//  voucher enter - extrenal voucher entery  api 