/* global Omise */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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
  useMediaQuery,
  List,
  ListItem,
  styled
} from '@mui/material';
import {
  LightbulbOutlined,
  TrendingUp,
  PhotoCamera,
  Dashboard,
  Campaign
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, StaticDatePicker, MobileDatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

import { FaSadTear } from 'react-icons/fa';
import { MdCancel } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import AddIcon from '@mui/icons-material/Add';

import RemoveIcon from '@mui/icons-material/Remove';
import CustomStepper from '../../component/timeline';
import BoatBookingLanding from '../LandingPage/landingPage_view';
import { AlertError, AlertLoading, AlertSuccess } from '../../component/popupAlert';

import { SendEmail, CreateSource, AddTicketboat, Getpayment, CheckBoat } from '../../service/booking_service';

import { Rules } from './booking_model';

const BookingView = () => {

  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [countPeople, setCountPeople] = useState(0);
  const [tel, setTel] = useState();
  const [disable, setDisable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submittingBtn, setSubmittingBtn] = useState(false);
  const DefaultDate = new Date();

  const timeSlots = ['9:00 - 10:30', '10:00 - 11:30', '11:00 - 12:30', '12:00 - 13:30', '13:00 - 14:30', '13:30 - 15:00'];

  const adultPrice = 1500;
  const childPrice = 1000;
  const totalPrice = adults * adultPrice + children * childPrice;

  const [first_name, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [last_name, setLastName] = useState('');
  const [address, setAddress] = useState('');

  const [step, setStep] = useState(1);
  const [People, setPeople] = useState(0);

  useEffect(() => {
    Omise.setPublicKey(process.env.REACT_APP_OMISE_PUBLIC_KEY)
    if (countPeople >= 5) {
      setDisable(false);
    } else {
      setDisable(true);
    }

    if (selectedDate && !selectedTime && adults === 0 && children === 0) {
      // Set to step 1 if only the date is selected and no time or people
      setStep(1);
      handleMaxPeople()
      setVisible(false);
    } else if (selectedDate && selectedTime) {
      // If both date and time are selected
      if (adults === 0 && children === 0) {
        // If no people are selected, move to step 2
        setStep(2);
        handleMaxPeople()
        setVisible(true);
        setSubmittingBtn(false);
      } else {
        // If there are people, move to step 3
        setStep(3);
        handleMaxPeople()
        setVisible(true);
        setSubmittingBtn(true);
      }
    }
    let People = 5 - (countPeople + adults + children)
    console.log(People)
    setPeople(People)
  }, [selectedDate, selectedTime, adults, children, countPeople]);

  const handleMaxPeople = async () => {
    const countPeople = await CheckBoat(format(selectedDate, 'yyyy-MM-dd'), selectedTime);
    console.log("Test", countPeople)
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
    setFirstname('');
    setLastName('');
    setEmail('');
    setOpenDialog(false);
  }

  const handleTimeSelect = (time) => {
    setDefaul()
    setSelectedTime(time);
  };

  const handleBooking = () => {
    Cookies.set('adults', adults, { expires: 1 })
    Cookies.set('children', children, { expires: 1 })
    Cookies.set('time', selectedTime, { expires: 1 })
    Cookies.set('date', selectedDate, { expires: 1 })
    Cookies.set('total_prices', totalPrice, { expires: 1 })
    handleSubmitted()
    //setOpenDialog(true);
  };

  const handlePickTime = (newValue) => {
    setDefaul()
    setSelectedDate(newValue);
  };

  const handleAdultsAdd = () => {
    //setAdults(adults + 1);
    if ((adults + children) === (5 - countPeople)) {
      setAdults(adults)
    } else {
      setAdults(adults + 1);
    }
  };

  const handleAdultsMinus = () => {
    setAdults(Math.max(0, adults - 1));
  };

  const handleChildrenAdd = () => {
    // setChildren(children + 1);
    if ((adults + children) === (5 - countPeople)) {
      setChildren(children)
    } else {
      setChildren(children + 1)
    }
  };

  const handleChildrenMinus = () => {
    setChildren(Math.max(0, children - 1));
  };

  const handleSubmitted = async () => {
    setOpenDialog(false);
    let paymentState = {}
    // if (!first_name || !last_name || !address || !email || !tel || !selectedTime) {
    //   AlertError('เกิดข้อผิดพลาด', 'กรอกข้อมูลให้ครบถ้วน')
    //   return;
    // }

    if (children >= 0 && adults <= 0) {
      AlertError('เกิดข้อผิดพลาด', 'จำนวนผู้โดยสาร "ผู้ใหญ่" น้อยเกินกำหนด')
      return;
    }

    if (countPeople + (adults + children) < 6) {
      if (children < 4) {
        // AlertLoading()

        // try {
        //   const bookingData = {
        //     "id": uuidv4(),
        //     "date": format(selectedDate, 'yyyy-MM-dd'),
        //     "time": selectedTime,
        //     "adults": adults,
        //     "children": children,
        //     "total_people": adults + children,
        //     "total_price": totalPrice,
        //     'first_name': first_name,
        //     'last_name': last_name,
        //     'email': email,
        //     'tel': tel,
        //     'address': address,
        //     'creat_date': new Date().toISOString()
        //   };

        //   let omiseRes;
        //   try {
        //     omiseRes = await CreateSource(bookingData.total_price);
        //   } catch (error) {
        //     AlertError('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างแหล่งการชำระเงินได้')
        //     throw new Error('ไม่สามารถสร้างแหล่งการชำระเงินได้');
        //   }

        //   const paymentData = {
        //     "ticketID": bookingData.id,
        //     "source": omiseRes.id,
        //     "amount": bookingData.total_price,
        //   }

        //   try {
        //     await AddTicketboat(bookingData);
        //   } catch (error) {
        //     AlertError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกการจองได้ โปรดลองอีกครั้งในภายหลัง')
        //   }

        //   try {
        //     await SendEmail(bookingData);
        //   } catch (error) {
        //     AlertError('เกิดข้อผิดพลาด', 'ไม่สามารถส่งอีเมลได้')
        //   }

        //   try {
        //     paymentState = await Getpayment(paymentData);
        //   } catch (error) {
        //     AlertError('เกิดข้อผิดพลาด', 'ไม่สามารถดำเนินการชำระเงินได้')
        //   }

        //   AlertSuccess('สำเร็จ', 'ข้อมูลการจองของคุณถูกบันทึกเรียบร้อยแล้ว')
        //   window.location.href = paymentState.redirectUrl;
        // } catch (error) {

        //   AlertError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกการจองได้ โปรดลองอีกครั้งในภายหลัง')
        // }
        navigate('/checkout')
      } else {
        AlertError('จำนวนผู้โดยสาร "เด็ก" มากเกินกำหนด')
      }
    } else {
      AlertError('เกิดพลาด', 'ไม่สามารถบันทึกการจองได้ เนื่องจากผู้โดยสารเกินกำหนด')
    }
    handleMaxPeople();
  };

  const ScrollableContent = styled(Box)(({ theme }) => ({
    height: '70vh',
    overflowY: isMobile ? 'scroll' : 'auto',
    padding: theme.spacing(2),
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main,
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.primary.dark,
    },
  }));

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
                ขนะนี้มีที่นั่งเหลืออยู่ {People} ที่นั่ง
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
            <MdCancel size={56} color='red' />
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
    <Box>
      <Box
        sx={{
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
          padding: isMobile ? 0 : theme.spacing(2),
        }}
      >
        <Box sx={{
          position: 'relative',
          minHeight: isMobile ? 'auto' : '64vh',
          borderRadius: 3,
          width: isMobile ? '100%' : '70%',
          padding: isMobile ? 0 : theme.spacing(2),
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

          <Box sx={{ position: 'relative', zIndex: 1, width: '96%' }}>
            <CustomStepper currentStep={step - 1} />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg"
              sx={{
                mt: 1,
                margin: isMobile ? 0 : 'auto',
                backgroundClip: 'white',
                opacity: '1',
                position: 'relative', zIndex: 1
              }}>
              <Paper elevation={3} sx={{ mt: 3, p: 1, width: '96%', margin: 0 }} >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    {isMobile ? (
                      <MobileDatePicker

                        label="Select Date"
                        value={selectedDate}
                        minDate={DefaultDate}
                        onChange={(newValue) => handlePickTime(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    ) : (
                      <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        value={selectedDate}
                        minDate={DefaultDate}
                        onChange={(newValue) => handlePickTime(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" pt={2} gutterBottom>เลือกรอบเวลา</Typography>
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
                  {visible && (<Grid item xs={12} md={4}>
                    {handleCustomerText()}

                    <Box sx={{ padding: 1 }} >
                      <Typography variant="h6" gutterBottom>จำนวนผู้เดินทาง</Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography>ผู้ใหญ่ (THB {adultPrice})</Typography>
                        <Box display="flex" alignItems="center">
                          <Button onClick={(e) => handleAdultsMinus(e)} sx={{ width: '45px', height: '50px' }} disabled={!disable}>
                            <RemoveIcon />
                          </Button>
                          <Typography sx={{ mx: 2 }}>{adults}</Typography>
                          <Button onClick={(e) => handleAdultsAdd(e)} disabled={!disable}>
                            <AddIcon />
                          </Button>
                        </Box>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                          <Typography sx={{ color: 'red', fontSize: '12px' }} disabled={!disable}>* ต้องมีผู้ใหญ่อย่างน้อย 1 คน</Typography>
                        </Box>
                        <Typography>เด็ก (THB {childPrice})</Typography>
                        <Box display="flex" alignItems="center">
                          <Button onClick={(e) => handleChildrenMinus(e)} disabled={!disable}>
                            <RemoveIcon />
                          </Button>
                          <Typography sx={{ mx: 2 }}>{children}</Typography>
                          <Button onClick={(e) => handleChildrenAdd(e)} disabled={!disable}>
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
                        disabled={!submittingBtn}
                      >
                        ชำระเงิน
                      </Button>
                    </Box>
                  </Grid>)}
                </Grid>
              </Paper>

              <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="lg"
                fullWidth
                fullScreen={isMobile}
              >
                <DialogTitle
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    py: 2,
                  }}
                >
                  รายละเอียดการจอง
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                  <Grid container>
                    <Grid item xs={12} md={6} >
                      <ScrollableContent>
                        <Typography sx={{ mt: 2, color: 'black', fontSize: '18px', fontWeight: 'bold' }}>
                          ข้อปฏิบัติและเงื่อนไขในการใช้บริการเรือ:
                        </Typography>
                        {Rules.map((section, index) => (
                          <React.Fragment key={index}>
                            <Typography gutterBottom sx={{ mt: 2, color: 'black', fontSize: '16px', fontWeight: 'bold' }}>
                              {section.title}
                            </Typography>
                            <List>
                              {section.items.map((item, itemIndex) => (
                                <ListItem key={itemIndex}>
                                  <Typography sx={{ fontSize: '14px' }}>{item}</Typography>
                                </ListItem>
                              ))}
                            </List>
                          </React.Fragment>
                        ))}
                      </ScrollableContent>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, backgroundColor: 'white', height: isMobile ? '100%' : '70vh', }}>
                        <Typography variant="h6" gutterBottom>
                          ข้อมูลการจอง
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2">วันที่:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">{selectedDate.toLocaleDateString()}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">เวลา:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">{selectedTime}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">ผู้ใหญ่:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">{adults} คน</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">เด็ก:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">{children} คน</Typography>
                          </Grid>
                        </Grid>
                        <Typography variant="h6" color="primary" align="right" sx={{ mt: 2, mb: 3 }}>
                          ยอดรวม: {totalPrice.toFixed(2)} บาท
                        </Typography>
                        <TextField
                          fullWidth
                          label="ชื่อ"
                          value={first_name}
                          onChange={(e) => setFirstname(e.target.value)}
                          margin="normal"
                          variant="outlined"
                        />
                        <TextField
                          fullWidth
                          label="นามสกุล"
                          value={last_name}
                          onChange={(e) => setLastName(e.target.value)}
                          margin="normal"
                          variant="outlined"
                        />
                        <TextField
                          fullWidth
                          label="อีเมล"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          margin="normal"
                          variant="outlined"
                        />
                        <TextField
                          fullWidth
                          label="เบอร์โทรศัพท์"
                          type="tel"
                          value={tel}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setTel(value);
                            }
                          }}
                          margin="normal"
                          variant="outlined"
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                        />
                        <TextField
                          fullWidth
                          label="ที่อยู่"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          margin="normal"
                          variant="outlined"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button onClick={() => setOpenDialog(false)} sx={{ mr: 1 }}>
                    ยกเลิก
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitted}
                  >
                    ยืนยันการจอง
                  </Button>
                </DialogActions>
              </Dialog>
              {/* <Dialog open={openDialog} onClose={() => setOpenDialog(false)}  maxWidth="sm" fullWidth>
                <DialogTitle>
                  <Typography variant="h6">Can we keep in touch?</Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography variant="body1" gutterBottom>
                    Subscribe to get emails and messages from Canva about all these good things (you can unsubscribe anytime in Email Preferences):
                  </Typography>
                  <List>
                    {[
                      { icon: <LightbulbOutlined />, text: "A weekly dose of handy design tips and Canva updates" },
                      { icon: <TrendingUp />, text: "Top Trending Templates" },
                      { icon: <PhotoCamera />, text: "Special content from our photographers, illustrators and other creators" },
                      { icon: <Dashboard />, text: "Recommended templates just for you" },
                      { icon: <Campaign />, text: "Canva promotions and marketing" },
                    ].map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItem>
                    ))}
                  </List>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} color="primary" variant="contained" fullWidth>
                    Yes, subscribe me
                  </Button>
                  <Button onClick={() => setOpenDialog(false)} color="inherit" fullWidth>
                    Not now
                  </Button>
                </DialogActions>
              </Dialog> */}
            </Container>
          </LocalizationProvider>
        </Box>
      </Box>
      <BoatBookingLanding />
    </Box>
  );
};

export default BookingView;