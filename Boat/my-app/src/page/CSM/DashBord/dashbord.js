import React, { useEffect, useState } from 'react';

import { useNavigate, Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  Card,
  TextField,
  Pagination
} from '@mui/material';
import { FaCalendarAlt, FaPrint } from 'react-icons/fa';
import { FiEdit } from "react-icons/fi";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import AppBarComponent from '../../../component/appbar';
import { GetAllBookings, getBookingByDate, getCountTicketByDate } from '../../../service/booking_service';
import { FiAlertCircle } from "react-icons/fi";

const ITEMS_PER_PAGE = 20;
const Dashboard_View = () => {

  const timeSlots = [
    { time: '9:00 - 10:30', total_adults: 0, total_children: 0, total_people: 0, total: 5 },
    { time: '10:00 - 11:30', total_adults: 0, total_children: 0, total_people: 0, total: 5 },
    { time: '11:00 - 12:30', total_adults: 0, total_children: 0, total_people: 0, total: 5 },
    { time: '12:00 - 13:30', total_adults: 0, total_children: 0, total_people: 0, total: 5 },
    { time: '13:00 - 14:30', total_adults: 0, total_children: 0, total_people: 0, total: 5 },
    { time: '13:30 - 15:00', total_adults: 0, total_children: 0, total_people: 0, total: 5 },
  ];

  const navigate = useNavigate();
  const token = Cookies.get('token')
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [TicketData, setTicketData] = useState(timeSlots);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalBookings, setTotalBook] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const [dataFetched, setDataFetched] = useState(true)
  const [title, setTitle] = useState('ข้อมูลการจองทั้งหมด');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (dataFetched) {
      handleGetAllBooking(token);
    }

    setTotalCount(0)
    setDataFetched(false)
  }, [selectedDate]);

  const displayedBookings = Array.isArray(bookings) ? bookings.slice(startIndex, endIndex) : [];
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);


  const handleDateChange = (newDate) => {
    if (newDate !== selectedDate) {
      setSelectedDate(newDate);
      const formattedDate = formatDate(newDate);
      handleGetCountTicketByDate(formattedDate);
      handleGetBookingByDate(formattedDate);
      setTitle('ข้อมูลการจองในวันที่ : ' + formattedDate)
    }
  };

  const formatDate = (date) => {
    const jsDate = new Date(date.$d || date); // ตรวจสอบว่ามีคุณสมบัติ $d หรือไม่ และสร้างวัตถุ Date
    const day = String(jsDate.getDate()).padStart(2, '0');
    const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มที่ 0
    const year = jsDate.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleGetAllBooking = async () => {
    try {
      const res = await GetAllBookings(token);
      if (Array.isArray(res)) {
        setBookings(res); // Only set bookings if it's a valid array
        setTotalBook(res.length);
        // console.log("Get Booking : ", bookings);
        setTitle('ข้อมูลการจองทั้งหมด')
        
      } else {
        console.error('Invalid data structure for bookings:', res);
      }
    } catch (e) {
      console.log('Error fetching bookings:', e);
    }
  };

  const handleGetBookingByDate = async (formattedDate) => {
    try {
      const response = await getBookingByDate(formattedDate, token);
      if (Array.isArray(response)) {
        setBookings(response);
        setTotalBook(response.length);
      } else {
        console.error('Invalid response data for bookings:', response.data);
      }
    } catch (e) {
      console.log('Error fetching bookings by date:', e);
    }
  };

  const handleGetCountTicketByDate = async (newData) => {
    try {
      const res = await getCountTicketByDate(newData);
      let count = 0
      let totalPrice = 0;

      // สมมติว่า res เป็น array ที่มีข้อมูลของ timeSlots จาก API
      const updatedTimeSlots = timeSlots.map((slot) => {
        const matchingData = res.find((item) => item.time === slot.time);

        // ถ้าเจอเวลาเดียวกัน ให้ใช้ข้อมูลจาก API
        if (matchingData) {
          count += matchingData.total_people;
          totalPrice += matchingData.total_price;
          return {
            ...slot,
            total_adults: matchingData.total_adults,
            total_children: matchingData.total_children,
            total_people: matchingData.total_people,
            total: 5,
          };
        }
        return {
          ...slot,
          total_adults: 0,
          total_children: 0,
          total_people: 0,
          total: 5,
        };
      });
      // อัปเดต state ด้วยข้อมูลใหม่
      setTicketData(updatedTimeSlots);
      setTotalCount(count);
      setTotalPrice(totalPrice);

    } catch (e) {
      console.log(e);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'เสร็จสิ้น':
        return { color: 'success', backgroundColor: '#e6f4ea', textColor: '#34a853' };
      case 'รอชำระเงิน':
        return { color: 'warning', backgroundColor: '#fff8e1', textColor: '#ffa000' };
      case 'ยกเลิก':
        return { color: 'error', backgroundColor: '#fde7e7', textColor: '#d32f2f' };
      case 'ชำระเงินแล้ว':
        return { color: 'info', backgroundColor: '#e3f2fd', textColor: '#1976d2' };
      default:
        return { color: 'default', backgroundColor: '#f5f5f5', textColor: '#9e9e9e' };
    }
  };

  return (
    <Box sx={{height:'142vh'}}>
      <AppBarComponent />
      <Box sx={{ p: 3}}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'space-between'} alignItems="center" mb={1}>
                  <Box display="flex" justifyContent={'space-between'} alignItems="center">
                    <FaCalendarAlt style={{ marginRight: '8px' }} />

                    <Typography variant="body1">ระบุวันที่จองทริปข้อมูล</Typography>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      startIcon={<FaPrint />}
                      width={'50%'}
                      onClick={handleGetAllBooking}
                      sx={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        border: '1px solid #ccc',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    >
                      รายการจองทั้งหมด
                    </Button>
                  </Box>
                </Box>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  format="DDMMYYYY"
                />
              </Grid>
              <Grid item xs={12} sm={3} textAlign="center">
                <Card>
                  <Typography variant="body1">จำนวนที่ให้บริการ</Typography>
                  <Typography variant="h4">{totalCount} / 30</Typography>
                  <Typography variant="body2">(เหลือ {30 - totalCount} ที่)</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3} textAlign="center">
                <Card>
                  <Typography variant="body1">รายได้วันนี้</Typography>
                  <Typography variant="h4">{totalPrice} บาท</Typography>
                  <Typography variant="body2">(รายการจองทั้งหมด {totalBookings} รายการ)</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  startIcon={<FaPrint />}
                  fullWidth
                  sx={{
                    backgroundColor: '#e6f4ea',
                    color: '#34a853',
                    border: '1px solid #ccc',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  พิมพ์รายงาน
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </LocalizationProvider>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {TicketData.length > 0 && (
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>รายการจองทั้งหมด</Typography>
                {TicketData.map((slot, index) => (
                  <Card key={index} mb={2} sx={{ padding: 4, margin: 2 }}>
                    <Typography variant="body2" sx={{ fontSize: '24px' }}>รอบ : {slot.time}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(slot.total_people / slot.total) * 100}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      <Typography variant="body2" align="left">
                        ผู้ใหญ่ {slot.total_adults} คน เด็ก {slot.total_children}
                      </Typography>
                      <Typography variant="body2" align="right">
                        {slot.total_people}/{slot.total}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Paper>
            )}
          </Grid>
          {displayedBookings && displayedBookings.length > 0 ? (
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom color={'black'} fontWeight={'bold'}>
                {title}
              </Typography>
              <TableContainer component={Paper} sx={{ height: '100%' ,boxShadow:4}}>
                <Table boxShadow={4}>
                  <TableHead>
                    <TableRow>
                      <TableCell>หมายเลขตั๋ว</TableCell>
                      <TableCell>ชื่อลูกค้า</TableCell>
                      <TableCell>วันที่ใช้บริการ</TableCell>
                      <TableCell>จำนวน</TableCell>
                      <TableCell>มูลค่า</TableCell>
                      <TableCell>สถานะการชำระ</TableCell>
                      <TableCell>ตัวเลือก</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <Typography>{booking.booking_id || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2 }}>
                              {booking.name && booking.name.length >= 2
                                ? `${booking.first_name[0]}${booking.first_name[1]}`
                                : ''}
                            </Avatar>
                            <Box>
                              <Typography>คุณ {booking.first_name || 'N/A'} {booking.last_name || 'N/A'}</Typography>
                              <Typography sx={{ fontSize: '12px' }}>{booking.tel || 'N/A'}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{booking.date || 'N/A'}</Typography>
                          <Typography variant="body2">{booking.time || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{booking.total_people || 'N/A'} ที่นั่ง</Typography>
                          <Box>
                            <Typography variant="body2">
                              ผู้ใหญ่ : {booking.adults || 0} คน เด็ก : {booking.children || 0} คน
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {typeof booking.amount === 'number'
                            ? `${booking.amount.toLocaleString()} บาท`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status || 'N/A'}
                            size="medium"
                            sx={{
                              width: '100%',
                              backgroundColor: getStatusColor(booking.status).backgroundColor,
                              borderColor: getStatusColor(booking.status).textColor,
                              '& .MuiChip-label': {
                                color: getStatusColor(booking.status).textColor,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button

                            size="medium"
                            sx={{
                              width: '90%',
                              backgroundColor: '้gray',
                              borderColor: 'white',
                              '& .MuiChip-label': {
                                color: 'white',
                              },
                            }}
                            onClick={() => navigate('/admin/edit/' + booking.booking_id)}
                          >
                            <FiEdit fontSize={'24px'} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                />
              </Box>
            </Grid>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              width={'60%'}
              margin={6}
              paddingTop={'15%'}
              flexDirection="column" // จัดเรียงไอคอนและข้อความในแนวตั้ง
            >
              <FiAlertCircle style={{ fontSize: 50, color: "#1976d2" }} /> {/* ขนาดไอคอนและสี */}
              <Typography>No bookings available</Typography> {/* ข้อความแจ้งเตือน */}
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard_View;