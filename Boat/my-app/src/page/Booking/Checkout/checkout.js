/* global Omise */
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import { v4 as uuidv4 } from 'uuid';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Button,
    Box,
    TextField,
    useMediaQuery,
    List,
    ListItem,
    Divider,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Rules } from './checkout_model';


const CheckoutView = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const adults = Cookies.get('adults');
    const children = Cookies.get('children');
    const time = Cookies.get('time');
    const date = Cookies.get('date');
    let total_price = Cookies.get('total_prices');
    total_price = parseInt(total_price, 10); // Ensure total_price is an integer
    let vat = (total_price * 7) / 100
    vat = parseInt(vat, 10);

    const [checkoutData, setCheckoutData] = useState({})
    const [checkboxValues, setCheckboxValues] = useState({
        serviceTerms: false,
        personalData: false,
        serviceUpdates: false
    });

    const currencies = [
        {
            value: 'USD',
            label: '$',
        },
        {
            value: 'EUR',
            label: '€',
        },
        {
            value: 'BTC',
            label: '฿',
        },
        {
            value: 'JPY',
            label: '¥',
        },
    ];

    const handleChangeCheckbox = (event) => {
        const { name, checked } = event.target;
        setCheckboxValues({
            ...checkboxValues,
            [name]: checked
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCheckoutData({
            ...checkoutData,
            [name]: value
        });
    };

    const handleSubmitted = () => {
        console.log(checkoutData);
        console.log(checkboxValues)
    };

    return (
        <Box>
            <Box
                sx={{
                    height: '1000px',
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
                    backgroundSize: '100%  auto',
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
                    },
                    marginTop: '1700px'
                }}>
                    <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2}>
                        <Card sx={{ width: '70%', padding: '16px', boxShadow: 5 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom color={'black'}>
                                    ข้อมูลการจอง
                                </Typography>
                                <Divider />
                                <Box margin={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                วันที่ที่ใช้บริการ
                                            </Typography>
                                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', padding: '4px' }}>
                                                {date}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                เวลา
                                            </Typography>
                                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', padding: '4px' }}>
                                                {time}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                จำนวนผู้โดยสาร
                                            </Typography>
                                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', padding: '4px' }}>
                                                ผู้ใหญ่ {adults}  คน และ เด็ก {children} คน
                                            </Typography>
                                        </Grid>

                                    </Grid>
                                </Box>
                            </CardContent>
                            <CardContent>
                                <Typography variant="h5" gutterBottom color={'black'}>
                                    เงื่อนไขการให้บริการ
                                </Typography>
                                <Divider />
                                <Box marginTop={'16px'}>
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
                                </Box>
                                <Box marginLeft={'16px'}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="serviceTerms"
                                                    checked={checkboxValues.serviceTerms}
                                                    onChange={handleChangeCheckbox}
                                                />
                                            }
                                            label="ยินยอมเงื่อนไขการให้บริการ"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="personalData"
                                                    checked={checkboxValues.personalData}
                                                    onChange={handleChangeCheckbox}
                                                />
                                            }
                                            label="ยินยอมให้รวบรวมข้อมูลส่วนบุคล"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="serviceUpdates"
                                                    checked={checkboxValues.serviceUpdates}
                                                    onChange={handleChangeCheckbox}
                                                />
                                            }
                                            label="ยินยอมให้แจ้งข้อมูลข่าวสารการให้บริการ"
                                        />
                                    </FormGroup>
                                </Box>
                            </CardContent>
                            <CardContent>
                                <Typography variant="h5" gutterBottom color={'black'}>
                                    ข้อมูลลูกค้า
                                </Typography>
                                <Divider />
                                <Box margin={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography>ชื่อ</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="firstName"
                                                    margin='16px'
                                                    fullWidth
                                                    label="ชื่อ"
                                                    variant="outlined"
                                                    value={checkoutData.firstName}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>นามสกุล</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="lastName"
                                                    margin='16px'
                                                    fullWidth
                                                    label="นามสกุล"
                                                    variant="outlined"
                                                    value={checkoutData.lastName}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>Email</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="email"
                                                    margin='16px'
                                                    fullWidth
                                                    label="Email"
                                                    variant="outlined"
                                                    value={checkoutData.email}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>เบอร์โทรศัพท์</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="phone"
                                                    margin='16px'
                                                    fullWidth
                                                    label="เบอร์โทรศัพท์"
                                                    variant="outlined"
                                                    value={checkoutData.phone}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>ที่อยู่ / อาคาร / ถนน</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="address"
                                                    fullWidth
                                                    label="ที่อยู่"
                                                    variant="outlined"
                                                    value={checkoutData.address}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>จังหวัด</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="province"
                                                    fullWidth
                                                    select
                                                    label="จังหวัด"
                                                    value={checkoutData.province}
                                                    onChange={handleChange}
                                                >
                                                    {currencies.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>เขต / อำเภอ</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="district"
                                                    fullWidth
                                                    select
                                                    label="เขต / อำเภอ"
                                                    value={checkoutData.district}
                                                    onChange={handleChange}
                                                >
                                                    {currencies.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>แขวน / ตำบล</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="subdistrict"
                                                    fullWidth
                                                    select
                                                    label="แขวง / ตำบล"
                                                    value={checkoutData.subdistrict}
                                                    onChange={handleChange}
                                                >
                                                    {currencies.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>รหัสไปรศณีย์</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="postalCode"
                                                    margin='16px'
                                                    fullWidth
                                                    label="รหัสไปรศณีย์"
                                                    variant="outlined"
                                                    value={checkoutData.postalCode}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>จุดประสงค์การจอง</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="bookingPurpose"
                                                    margin='16px'
                                                    fullWidth
                                                    label="จุดประสงค์การจอง"
                                                    variant="outlined"
                                                    value={checkoutData.bookingPurpose}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                        <Card sx={{ width: '30%', height: '40vh', boxShadow: 5, padding: 2 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    สรุปยอดชำระเงิน
                                </Typography>
                            </CardContent>
                            <Box display="flex" flexDirection="row" gap={2} justifyContent={'space-between'} padding={2}>
                                <Box>
                                    <Typography gutterBottom>
                                        ราคารวม
                                    </Typography>
                                    <Typography gutterBottom>
                                        (ไม่รวมภาษีมูลค่าเพิ่ม)
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography gutterBottom>
                                        {total_price} บาท
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" flexDirection="row" gap={2} justifyContent={'space-between'} padding={2}>
                                <Box>
                                    <Typography gutterBottom>
                                        ภาษีมูลค่าเพิ่ม
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography gutterBottom>
                                        {vat} บาท
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider />
                            <Box display="flex" flexDirection="row" gap={2} justifyContent={'space-between'} padding={2}>
                                <Box>
                                    <Typography gutterBottom>
                                        ราคารวม
                                    </Typography>
                                    <Typography gutterBottom>
                                        (รวมภาษีมูลค่าเพิ่ม)
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography gutterBottom>
                                        {total_price + vat} บาท
                                    </Typography>
                                </Box>
                            </Box>
                            <Box >
                                <Button sx={{ bgcolor: "#1E90FF", width: "100%", borderRadius: 1, color: 'white' }} onClick={handleSubmitted} >
                                    ชำระเงิน
                                </Button>
                            </Box>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CheckoutView;