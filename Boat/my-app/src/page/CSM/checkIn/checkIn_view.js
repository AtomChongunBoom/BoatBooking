import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { getBookingByID, UpdateBooking } from '../../../service/booking_service';
import AppBarComponent from '../../../component/appbar';
import { AlertError, AlertLoading, AlertSuccess } from '../../../component/popupAlert';
import { Check } from '@mui/icons-material';

const CheckIn_View = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const token = Cookies.get('token');

    const [bookingId, setBookingId] = useState('');
    const [bookingData, setBookingData] = useState(null);
    const [dataOpen, setDataOpen] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleGetBookingById = async () => {
        try {
            const res = await getBookingByID({ token, id: bookingId });
            setBookingData(res.data);
            setDataOpen(true);
        } catch (error) {
            console.error("Error fetching booking data:", error);
            AlertError('ไม่สามารถดึงข้อมูลได้', error.message);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        handleGetBookingById();
    }

    const handleChange = (event) => {
        setBookingId(event.target.value);
    }

    const handleStatusUpdate = async (status) => {
        AlertLoading();
        try {
            const updatedData = { ...bookingData, status };
            await UpdateBooking(updatedData, token);
            setBookingData(updatedData);
            AlertSuccess('อัพเดทสถานะสำเร็จ');
        } catch (error) {
            AlertError('อัพเดทผิดพลาด', error.message);
        }
        setDataOpen(false)
    };

    const renderBookingDetails = () => (
        <>
            <BookingDetailItem label="ชื่อผู้จอง" value={`${bookingData.first_name} ${bookingData.last_name}`} />
            <BookingDetailItem label="วันที่" value={bookingData.date} />
            <BookingDetailItem label="รอบ" value={bookingData.time} />
            <BookingDetailItem label="จำนวน 'ผู้ใหญ่'" value={`${bookingData.adults} คน`} />
            <BookingDetailItem label="จำนวน 'เด็ก'" value={`${bookingData.children} คน`} />
            <BookingDetailItem label="สถานะการชำระ" value={bookingData.status} />
            <Divider sx={{ my: 2 }} />
            <BookingDetailItem label="ราคารวม (รวมภาษีมูลค่าเพิ่ม)" value={`${bookingData.amount} บาท`} isBold />
            <Box display="flex" justifyContent="space-between" gap={2}>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, bgcolor: 'red', color: 'white', '&:hover': { bgcolor: 'darkred' } }}
                    onClick={() => handleStatusUpdate("ยกเลิก")}
                >
                    ยกเลิกการจอง
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleStatusUpdate("เสร็จสิ้น")}
                >
                    ยืนยันการจอง
                </Button>
            </Box>
        </>
    );

    const BookingDetailItem = ({ label, value, isBold = false }) => (
        <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography fontWeight={isBold ? "bold" : "normal"}>{label}</Typography>
            <Typography fontWeight={isBold ? "bold" : "normal"}>{value}</Typography>
        </Box>
    );

    return (
        <Box>
            <AppBarComponent />
            <Box sx={{
                minHeight: '100vh',
                width: '100%',
                backgroundImage: `
                linear-gradient(to top, rgba(255, 255, 255, 255) 20%, rgba(0, 0, 0, 0) 100%),
                url(https://resource.nationtv.tv/uploads/images/md/2021/09/iZZnJJkBL2Sf64HoM8b5.jpg?x-image-process=style/lg)
            `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: theme.spacing(2),
            }}>
                <Box sx={{
                    position: 'relative',
                    minHeight: '64vh',
                    borderRadius: 3,
                    width: '70%',
                    padding: theme.spacing(2),
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'white',
                        opacity: 0.5,
                        borderRadius: 'inherit',
                    }
                }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box display="flex" justifyContent="space-between" gap={2}>
                            <Card sx={{ width: '45%', padding: '16px', boxShadow: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 400 }}>
                                    <Typography variant="h6" component="h1" gutterBottom fontWeight={'bold'} marginTop={4}>
                                        ระบุข้อมูลหมายเลขตั๋ว
                                    </Typography>
                                    <TextField
                                        label="หมายเลขตั๋ว"
                                        variant="outlined"
                                        onChange={handleChange}
                                        value={bookingId}
                                        fullWidth
                                    />
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </Box>
                            </Card>

                            <Card sx={{ width: '50%', height: '50vh', boxShadow: 5, padding: 2 }}>
                                <Box display="flex" flexDirection="column" gap={2} justifyContent={'space-between'} padding={2}>
                                    {dataOpen ? renderBookingDetails() : (
                                        <Typography gutterBottom fontWeight={'bold'} color={'#1a237e'} fontSize={'24px'}>
                                            กรุณากรอกหมายเลขตั๋วและกด Submit เพื่อดูข้อมูลการจอง
                                        </Typography>
                                    )}
                                </Box>
                            </Card>
                        </Box>
                    </LocalizationProvider>
                </Box>
            </Box>
        </Box>
    );
};

export default CheckIn_View;