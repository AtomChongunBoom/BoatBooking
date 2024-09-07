import axios from "axios";

export const UserLogin = async (data) => {
    try {
        const response = await axios.post('http://localhost:8000/login', data)
        return response.data
    } catch (error) {
        console.error('Error sending email:', error)
        throw new Error('Failed to send email. Please try again later.')
    }
}

export const authenticateUser = async (token) => {
    try {
        const response = await axios.post('http://localhost:8000/authen', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error authenticating user:', error.response ? error.response.data : error.message);
        throw new Error('Authentication failed');
    }
  };

export const UserRegister = async (data) => {
    try {
        const response = await axios.post('http://localhost:8000/register', data)
        return response.data.user
    } catch (error) {
        console.error('Error sending email:', error)
        throw new Error(error)
    }
}