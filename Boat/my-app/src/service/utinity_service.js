import axios from 'axios'

export const getProvince = async () =>{
    try {
        const response = await axios.get('http://localhost:8000/provinces')
        let data = response.data;
        let tempdata = [];
    
        for (let i = 0; i < data.length; i++) {
          tempdata.push({
            value: data[i].id,
            label: data[i].name_th,
          });
        }
        console.log(tempdata);
        return tempdata;
    } catch (error) {
        console.error('Error fetching data:', error)
        throw []
    }
}

export const getDistricts = async () =>{
    try {
        const response = await axios.get(`http://localhost:8000/districts`)
        let data = response.data;
        let tempdata = [];
        console.log("response",data)
        for (let i = 0; i < data.length; i++) {
          tempdata.push({
            value: data[i].id,
            label: data[i].name_th,
            province_id: data[i].province_id
          });
        }
        return tempdata;
    } catch (error) {
        console.error('Error fetching data:', error)
        throw []
    }
}

export const getSubDistrict = async () =>{
  try {
        const response = await axios.get(`http://localhost:8000/subdistricts`)
        let data = response.data;
        let tempdata = [];
    
        for (let i = 0; i < data.length; i++) {
          tempdata.push({
            value: data[i].id,
            label: data[i].name_th,
            district_id: data[i].amphure_id,
            zip_code : data[i].zip_code
          });
        }
        console.log("API : ",data);
        return tempdata;
    } catch (error) {
        console.error('Error fetching data:', error)
        return []
    }
}
