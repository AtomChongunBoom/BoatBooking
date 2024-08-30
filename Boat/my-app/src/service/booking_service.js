import axios from 'axios'

export const SendEmail = async (data) =>{
    try{
        console.log(data)
        await axios.post('http://localhost:8000/send-email', data)
    }catch(error){
        console.error('Error sending email:', error)
    }
}