/* global Omise */
import axios from 'axios'

export const AddTicketboat = async (data) => {
    try {
        
        const response = await axios.post('http://localhost:8000/addTicketboat', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding ticket boat:', error);
        if (error.response) {
            //throw new Error(`Failed to add ticket boat: ${error.response.data.message || 'Unknown error'}`)
            return []
        } else if (error.request) {
            //throw new Error('No response received from server. Please check your connection.')
            return []
        } else {
            // throw new Error('Failed to add ticket boat. Please try again.')
            return []
        }
    }
};