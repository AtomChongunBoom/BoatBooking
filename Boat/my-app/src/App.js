import React, { useState, useEffect } from 'react';
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
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CustomStepper from './component/timeline';
const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const timeSlots = ['9:00 - 10:30', '10:00 - 11:30', '11:00 - 12:30', '12:00 - 13:30', '13:00 - 14:30', '13:30 - 15:00'];

  const adultPrice = 1500;
  const childPrice = 1000;
  const totalPrice = adults * adultPrice + children * childPrice;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [step, setStep] = useState(1);

  useEffect(() => {
    if (selectedDate && !selectedTime && adults === 0 && children === 0) {
      setStep(1);
    } else if (selectedDate && selectedTime && adults === 0 && children === 0) {
      setStep(2);
    } else if (selectedDate && selectedTime && (adults !== 0 || children !== 0)) {
      setStep(3);
    }
  }, [selectedDate, selectedTime, adults, children]); // Dependencies

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    setOpenDialog(true);
  };

  const handlePickTime = (newValue) => {
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

  const handleSubmitted = () => {
    const bookingData = {
      "วันที่": selectedDate.toLocaleDateString(),
      "เวลา": selectedTime,
      "ผู้ใหญ่": adults,
      "เด็ก": children,
      "ยอด": totalPrice,
      'Customer': name,
      'email': email
    };
    console.log("Data:", bookingData);
    setOpenDialog(false);
  };
  
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
        <CustomStepper currentStep={step-1} />
        <LocalizationProvider dateAdapter={AdapterDateFns} sx={{ width: '100%' }}>
          <Container maxWidth="lg" sx={{ mt: 4, backgroundClip: 'white', opacity: '100%', zIndex: 1 }}>

            <Paper elevation={3} sx={{ mt: 3, p: 1, width: '100%' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} >
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    value={selectedDate}
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
                  <Typography variant="h6" gutterBottom>จำนวนผู้เดินทาง</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography>ผู้ใหญ่ (THB {adultPrice})</Typography>
                    <Box display="flex" alignItems="center">
                      <Button onClick={(e) => handleAdultsMinus(e)}>
                        <RemoveIcon />
                      </Button>
                      <Typography sx={{ mx: 2 }}>{adults}</Typography>
                      <Button onClick={(e) => handleAdultsAdd(e)}>
                        <AddIcon />
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
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
                </Grid>
              </Grid>
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>รายละเอียดการจอง</DialogTitle>
              <DialogContent>
                <Typography>วันที่: {selectedDate.toLocaleDateString()}</Typography>
                <Typography>เวลา: {selectedTime}</Typography>
                <Typography>ผู้ใหญ่: {adults} คน</Typography>
                <Typography>เด็ก: {children} คน</Typography>
                <Typography variant="h6">ยอดรวม: {totalPrice.toFixed(2)} บาท</Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  label="ชื่อ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="อีเมล"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
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

export default App;