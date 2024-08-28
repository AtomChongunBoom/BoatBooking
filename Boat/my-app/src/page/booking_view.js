import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card
} from '@mui/material';
import Swal from 'sweetalert2';
import { IoMdPerson } from "react-icons/io";
import { FaSadTear } from 'react-icons/fa';
import { MdCancel } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CustomStepper from '../component/timeline';
import { format } from 'date-fns';
import axios from 'axios';

const BookingView = () => {

  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [countPeople, setCountPeople] = useState(0);
  const [tel, setTel] = useState();
  const [disable, setDisable] = useState(false);

  const DefaultDate = new Date();

  const timeSlots = ['9:00 - 10:30', '10:00 - 11:30', '11:00 - 12:30', '12:00 - 13:30', '13:00 - 14:30', '13:30 - 15:00'];

  const adultPrice = 1500;
  const childPrice = 1000;
  const totalPrice = adults * adultPrice + children * childPrice;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [step, setStep] = useState(1);

  useEffect(() => {

    if (countPeople >= 5) {
      setDisable(false);
    } else {
      setDisable(true);
    }

    if (selectedDate && !selectedTime && adults === 0 && children === 0) {
      // Set to step 1 if only the date is selected and no time or people
      setStep(1);
      handleMaxPeople()
    } else if (selectedDate && selectedTime) {
      // If both date and time are selected
      if (adults === 0 && children === 0) {
        // If no people are selected, move to step 2
        setStep(2);
        handleMaxPeople()
      } else {
        // If there are people, move to step 3
        setStep(3);
        handleMaxPeople()
      }
    }
  }, [selectedDate, selectedTime, adults, children, countPeople]);

  const handleMaxPeople = async () => {
    const countPeople = await CheckBoat(format(selectedDate, 'yyyy-MM-dd'), selectedTime);
    console.log(selectedDate)
    console.log(countPeople)
    if (countPeople.total_people && countPeople.total_people > 0) {
      setCountPeople(countPeople.total_people);
    } else {
      setCountPeople(0);
    }
  }

  const setDefaul = async () => {
    setAdults(0);
    setChildren(0);
    setTel('');
    setName('');
    setEmail('');
    setOpenDialog(false);
  }

  const handleTimeSelect = (time) => {
    setDefaul()
    setSelectedTime(time);
  };

  const handleBooking = () => {
    setOpenDialog(true);
  };

  const handlePickTime = (newValue) => {
    setDefaul()
    setSelectedDate(newValue);
  };

  const handleAdultsAdd = () => {
    setAdults(adults + 1);
  };

  const handleAdultsMinus = () => {
    setAdults(Math.max(0, adults - 1));
  };

  const handleChildrenAdd = () => {
    setChildren(children + 1);
  };

  const handleChildrenMinus = () => {
    setChildren(Math.max(0, children - 1));
  };

  const handleSubmitted = async () => {
    if (!name || !email || !tel || !selectedTime) {
      setOpenDialog(false);
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลให้ครบ',
        text: 'โปรดกรอกข้อมูลในช่องที่จำเป็นทั้งหมด'
      });
      return;
    }

    if (children > 0 && adults <= 0) {
      setOpenDialog(false);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'จำนวนผู้โดยสาร "ผู้ใหญ่" น้อยเกินกำหนด'
      });
      return;
    }

    if (countPeople + (adults + children) < 6) {
      if (children < 4) {
        try {
          const bookingData = {
            "id": uuidv4(),
            "date": format(selectedDate, 'yyyy-MM-dd'),
            "time": selectedTime,
            "adults": adults,
            "children": children,
            "total_people": adults + children,
            "total_price": totalPrice,
            'customer_name': name,
            'email': email,
            'tel': tel,
            'creat_date': new Date().toISOString()
          };
          console.log(bookingData.creat_date);
          await addTicketboat(bookingData);

          setOpenDialog(false);

          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ!',
            text: 'ข้อมูลการจองของคุณถูกบันทึกเรียบร้อยแล้ว'
          });
        } catch (error) {
          console.error("Error submitting booking:", error);

          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถบันทึกการจองได้ โปรดลองอีกครั้งในภายหลัง'
          });
          setOpenDialog(false);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'จำนวนผู้โดยสาร "เด็ก" มากเกินกำหนด'
        });
        setOpenDialog(false);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกการจองได้ เนื่องจากผู้โดยสารเกินกำหนด'
      });
      setOpenDialog(false);
    }
    handleMaxPeople()
  };

  const addTicketboat = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/addTicketboat', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding ticket boat:', error);
      throw error;
    }
  };

  const CheckBoat = async (date, time) => {
    try {
      console.log(date);
      console.log(time);
      const response = await axios.get(`http://localhost:8000/getCount/${date}/${time}`);
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const handleCustomerText = () => {
    if (disable) {
      // return (
      // <Box>
      //   <Typography variant="h6" gutterBottom className="mb-2" sx={{ color: 'green', fontWeight: 'bold' }}>
      //     ขนะนี้มีที่นั่งเหลืออยู่ {5 - countPeople} ที่นั่ง
      //   </Typography>

      //   <Typography gutterBottom className="mb-2" sx={{ color: '#b0b0b0', fontWeight: 'bold', fontSize: '16px' }}>
      //     รีบจองก่อนที่จะเต็ม
      //   </Typography>
      // </Box>
      // )
      return (
        <Box className="text-center" sx={{ padding: 1, display: 'flex' }}>
          <Box m={1}>
            <BsCheckCircleFill size={48} color='green' />
          </Box>
          <Box>
            <Box>
              <Typography variant="h6" gutterBottom className="mb-2" sx={{ color: 'green', fontWeight: 'bold' }}>
                ขนะนี้มีที่นั่งเหลืออยู่ {5 - countPeople} ที่นั่ง
              </Typography>

              <Typography gutterBottom className="mb-2" sx={{ color: '#b0b0b0', fontWeight: 'bold', fontSize: '16px' }}>
                กรุณากรอกข้อมูลจำนวนคน
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    } else {
      return (
        <Box className="text-center" sx={{ padding: 1, display: 'flex' }}>
          <Box m={1}>
            <MdCancel size={52} color='red' />
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom className="mb-2" sx={{ color: 'red', fontWeight: 'bold' }}>
              ที่นั่งทั้งหมดเต็มแล้ว
            </Typography>
            <Typography gutterBottom className="mb-2" sx={{ color: '#b0b0b0', fontWeight: 'bold', fontSize: '16px' }}>
              กรุณาเลือกรอบถัดไป
            </Typography>
          </Box>
        </Box>
      )
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `
          linear-gradient(to top, rgba(255, 255, 255, 255) 40%, rgba(0, 0, 0, 0) 100%),
          url(https://resource.nationtv.tv/uploads/images/md/2021/09/iZZnJJkBL2Sf64HoM8b5.jpg?x-image-process=style/lg)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ bgcolor: 'white', opacity: '90%', height: '64vh', borderRadius: 3, width: '70%' }}>
        <CustomStepper currentStep={step - 1} />
        <LocalizationProvider dateAdapter={AdapterDateFns} sx={{ width: '100%' }}>
          <Container maxWidth="lg" sx={{ mt: 4, backgroundClip: 'white', opacity: '100%', zIndex: 1 }}>
            <Paper elevation={3} sx={{ mt: 3, p: 1, width: '100%' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} >
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    value={selectedDate}
                    minDate={DefaultDate}
                    onChange={(newValue) => handlePickTime(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs={12} md={4} >
                  <Typography variant="h6" gutterBottom>เลือกรอบเวลา</Typography>
                  <Grid container spacing={1}>
                    {timeSlots.map((time) => (
                      <Grid item xs={6} key={time}>
                        <Button
                          fullWidth
                          variant={selectedTime === time ? "contained" : "outlined"}
                          onClick={() => handleTimeSelect(time)}
                          sx={{ borderRadius: 4 }}
                        >
                          {time}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4} p={4}>
                  {handleCustomerText()}
                  {disable && (<Box sx={{ padding: 1 }}>
                    <Typography variant="h6" gutterBottom>จำนวนผู้เดินทาง</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography>ผู้ใหญ่ (THB {adultPrice})</Typography>
                      <Box display="flex" alignItems="center">
                        <Button onClick={(e) => handleAdultsMinus(e)} sx={{width:'45px',height:'50px'}}>
                          <RemoveIcon/>
                        </Button>
                        <Typography sx={{ mx: 2 }}>{adults}</Typography>
                        <Button onClick={(e) => handleAdultsAdd(e)}>
                          <AddIcon />
                        </Button>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{display:'flex',justifyContent:'end'}}>
                        <Typography sx={{ color: 'red', fontSize: '12px' }}>* ต้องมีผู้ใหญ่อย่างน้อย 1 คน</Typography>
                      </Box>
                      <Typography>เด็ก (THB {childPrice})</Typography>
                      <Box display="flex" alignItems="center">
                        <Button onClick={(e) => handleChildrenMinus(e)}>
                          <RemoveIcon />
                        </Button>
                        <Typography sx={{ mx: 2 }}>{children}</Typography>
                        <Button onClick={(e) => handleChildrenAdd(e)}>
                          <AddIcon />
                        </Button>
                      </Box>
                    </Box>
                    <Typography variant="h6" align="right">ยอดรวม: {totalPrice.toFixed(2)} บาท</Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleBooking}
                      sx={{ mt: 2 }}
                    >
                      ชำระเงิน
                    </Button>
                  </Box>)}
                  {!disable && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '80%' }}>
                      <FaSadTear
                        color="#1E90FF"
                        size={100} // Adjust the size as needed
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
              <DialogTitle style={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white }}>
                  รายละเอียดการจอง
              </DialogTitle>
              <Box >
                <Typography>
                  ข้อกำหนด
                </Typography>
              </Box>
              <DialogContent dividers style={{ padding: theme.spacing(3), backgroundColor: theme.palette.background.default }}>
                <Typography variant="body1" gutterBottom>วันที่: {selectedDate.toLocaleDateString()}</Typography>
                <Typography variant="body1" gutterBottom>เวลา: {selectedTime}</Typography>
                <Typography variant="body1" gutterBottom>ผู้ใหญ่: {adults} คน</Typography>
                <Typography variant="body1" gutterBottom>เด็ก: {children} คน</Typography>

                <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', justifyContent: 'end' }} >ยอดรวม: {totalPrice.toFixed(2)} บาท</Typography>

                <TextField
                  margin="normal"
                  fullWidth
                  label="ชื่อ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  color="primary"
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="อีเมล"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  color="primary"
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="เบอร์โทรศัพท์"
                  inputProps={{
                    inputMode: 'numeric',  // สำหรับแสดงคีย์บอร์ดตัวเลขบนมือถือ
                    pattern: '[0-9]*',     // สำหรับอนุญาตเฉพาะตัวเลข
                  }}
                  type="tel"
                  value={tel}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setTel(value);
                    }
                  }}
                  variant="outlined"
                  color="primary"
                />
              </DialogContent>
              <DialogActions style={{ padding: theme.spacing(2) }}>
                <Button onClick={() => setOpenDialog(false)} sx={{}}>
                  ยกเลิก
                </Button>
                <Button variant="contained" color="primary" onClick={(e) => handleSubmitted(e)}>
                  ยืนยันการจอง
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </LocalizationProvider>
      </Box>
      
    </Box>
  );
};

export default BookingView;