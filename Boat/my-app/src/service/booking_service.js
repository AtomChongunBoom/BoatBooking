/* global Omise */
import axios from 'axios'

export const SendEmail = async (data) => {
    try {
        const response = await axios.post('http://localhost:8000/send-email', data)
        return response.data
    } catch (error) {
        console.error('Error sending email:', error)
        throw new Error('Failed to send email. Please try again later.')
    }
}

export const CreateSource = (amount) => {
    return new Promise((resolve, reject) => {
        Omise.createSource('rabbit_linepay', {
            "amount": amount * 100,
            "currency": "THB",
        }, (statusCode, response) => {
            if (statusCode !== 200) {
                console.error('Error creating source:', response)
                return reject(new Error('Failed to create payment source. Please try again.'))
            }
            resolve(response)
        })
    })
}

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
            throw new Error(`Failed to add ticket boat: ${error.response.data.message || 'Unknown error'}`)
        } else if (error.request) {
            throw new Error('No response received from server. Please check your connection.')
        } else {
            throw new Error('Failed to add ticket boat. Please try again.')
        }
    }
};

export const Getpayment = async (data) => {
    try {
        const response = await axios.post('http://localhost:8000/payment', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting payment:', error);
        if (error.response) {
            throw new Error(`Payment error: ${error.response.data.message || 'Unknown error'}`)
        } else if (error.request) {
            throw new Error('No response received from payment server. Please try again.')
        } else {
            throw new Error('Failed to process payment. Please try again.')
        }
    }
};