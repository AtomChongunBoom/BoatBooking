/* global Omise */
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { getProvince, getDistricts, getSubDistrict, getZipCode } from '../../../service/utinity_service';
import { AlertError, AlertSuccess } from '../../../component/popupAlert';

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
    Checkbox,
    Autocomplete
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { v4 as uuidv4 } from 'uuid';
import { Rules } from './checkout_model';
import { AddTicketboat, SendEmail, CreateSource, Getpayment } from '../../../service/booking_service';


const CheckoutView = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [province, setProvince] = useState([])
    const [district, setDistrict] = useState([])
    const [subdistrict, setSubdistrict] = useState([])
    const [districtDefaut, setDistrictDefaut] = useState([])
    const [subdistrictDefaut, setSubdistrictDefaut] = useState([])
    const [zip_code, setZipCode] = useState([])

    const [adults, setAdults] = useState(0); // Initial value can be adjusted
    const [children, setChildren] = useState(0); // Initial value can be adjusted
    const [time, setTime] = useState(''); // Initial value can be adjusted
    const [date, setDate] = useState(''); // Initial value can be adjusted
    const [total_price, setTotal_price] = useState(0); // Initial value can be adjusted
    let vat = (total_price * 7) / 100
    vat = parseInt(vat, 10);

    const [checkoutData, setCheckoutData] = useState({})
    const [checkboxValues, setCheckboxValues] = useState({
        serviceTerms: false,
        personalData: false,
        serviceUpdates: false
    });

    const [dataFetched, setDataFetched] = useState(false);
    useEffect(() => {
        if (!dataFetched) {
            Omise.setPublicKey(process.env.REACT_APP_OMISE_PUBLIC_KEY)
            init();
        }
        const adults = parseInt(Cookies.get('adults'), 10) || 0;
        const children = parseInt(Cookies.get('children'), 10) || 0;
        const time = Cookies.get('time');
        const date = Cookies.get('date');
        const total_price = parseInt(Cookies.get('total_prices'), 10) || 0;

        setTotal_price(total_price)
        setAdults(adults)
        setChildren(children)
        setTime(time)
        setDate(date)
    }, [checkboxValues, checkoutData]);

    const init = async () => {
        try {

            const responseProvince = await getProvince();
            setProvince(responseProvince);

            const responseAmphur = await getDistricts();
            if (districtDefaut == []) {
                setDistrict(responseAmphur)
            }
            setDistrictDefaut(responseAmphur);
            const responseSubDistrict = await getSubDistrict();
            if (districtDefaut == []) {
                setSubdistrict(responseSubDistrict)
            }
            setSubdistrictDefaut(responseSubDistrict);

        } catch (error) {
            console.error("Error during initialization:", error);
        }
    };

    const handleChangeCheckbox = (event) => {
        const { name, checked } = event.target;
        const updatedCheckboxValues = {
            ...checkboxValues,
            [name]: checked
        };

        setCheckboxValues(updatedCheckboxValues);

    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value)
        setCheckoutData({
            ...checkoutData,
            [name]: value
        });
    };

    const handleSubmitted = async () => {
        // Check if all checkboxes are checked
        const allChecked = Object.values(checkboxValues).every(value => value === true);

        if (!allChecked) {
            AlertError('เกิดข้อผิดพลาด', 'กรุณากดยอมรับเงื่อนไข');
            return;
        }

        const typeDate = new Date(date)

        // // Prepare the booking data
        // console.log('preparing', checkoutData);
        const bookingData = {
            id: uuidv4(),
            date: format(typeDate, 'yyyy-MM-dd'),
            time: time,
            adults: adults,
            children: children,
            total_people: adults + children,
            vat: vat,
            amount: total_price,
            total_price: total_price + vat,
            first_name: checkoutData.firstName,
            last_name: checkoutData.lastName,
            email: checkoutData.email,
            tel: checkoutData.phone,
            address: checkoutData.address,
            province: checkoutData.province_id,
            district: checkoutData.district_id,
            subdistrict: checkoutData.subdistrict_id,
            zip_code: checkoutData.zip_code,
            note: checkoutData.note,
            creat_date: new Date().toISOString()
        };

        // try {
        //     await SendEmail(bookingData);
        // } catch (error) {
        //     AlertError('เกิดข้อผิดพลาด', 'ไม่สามารถส่งอีเมลได้')
        // }
        // console.log("data", bookingData);

        try {
            await AddTicketboat(bookingData);
            AlertSuccess('สำเร็จ', 'ข้อมูลการจองของคุณถูกบันทึกเรียบร้อยแล้ว')
            // Optionally, handle successful booking here (e.g., show a success message)
        } catch (error) { // Log the error for debugging
            AlertError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกการจองได้ โปรดลองอีกครั้งในภายหลัง');
            return
        }

        let omiseRes;
        try {
            omiseRes = await CreateSource(bookingData.amount);
            console.log("omiseRes",omiseRes);
            //window.location.href = paymentState.redirectUrl;
        } catch (error) {
            AlertError('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างแหล่งการชำระเงินได้')
            // throw new Error('ไม่สามารถสร้างแหล่งการชำระเงินได้');
            return
        }

        let paymentState = {}
            const paymentData = {
                "ticketID": bookingData.id,
                "source": omiseRes.id,
                "amount": bookingData.amount,
            }

        try {
            paymentState = await Getpayment(paymentData);
        } catch (error) {
            AlertError('เกิดข้อผิดพลาด', 'ไม่สามารถดำเนินการชำระเงินได้')
            return
        }
        const cookiesToRemove = ['adults', 'children', 'time', 'total_prices', 'date'];

        cookiesToRemove.forEach(cookie => Cookies.remove(cookie));
        window.location.href = paymentState.redirectUrl;
    };


    const handleChangeAutocomplate = async (event, newValue, name) => {
        // Log the new value to confirm it's being passed correctly
        console.log("New Value:", newValue);

        // Create a new checkoutData object based on the current input
        let updatedData = { ...checkoutData };

        if (newValue) {
            if (name === 'zip_code') {
                updatedData[name] = newValue.zip_code;
            } else {
                updatedData[name] = newValue.value;
            }
            console.log(name);
        }

        setCheckoutData(updatedData);

        // Handle subdistrict selection
        if (name === "subdistrict_id" && newValue?.value) {
            const currentSubdistricts = subdistrictDefaut.filter(d => newValue.value === d.value);
            console.log("Filtered Subdistricts:", currentSubdistricts);
            setZipCode(currentSubdistricts);  // Set zip code based on the current subdistrict
        }

        // Handle province selection
        else if (name === "province_id" && newValue?.value) {
            const currentDistricts = districtDefaut.filter(p => newValue.value === p.province_id);
            console.log("Filtered Districts:", currentDistricts);
            setDistrict(currentDistricts);  // Set the filtered districts
        }

        // Handle district selection
        else if (name === "district_id" && newValue?.value) {
            const currentSubdistricts = subdistrictDefaut.filter(d => newValue.value === d.district_id);
            console.log("Filtered Subdistricts:", currentSubdistricts);
            setSubdistrict(currentSubdistricts);  // Set the filtered subdistricts
        }

    };

    return (
        <Box>
            <Box
                sx={{
                    maxHeight: '100vh',
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
                    marginTop: isMobile ? '3200px' : '1700px'
                }}>
                    <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2} sx={{ position: 'relative', zIndex: 1 }}>
                        <Card sx={{ width: '70%', padding: '16px', boxShadow: 5 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom color={'black'} fontWeight={'bold'}>
                                    ข้อมูลการจอง
                                </Typography>
                                <Divider />
                                <Box margin={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#aa8c15' }}>
                                                วันที่ที่ใช้บริการ
                                            </Typography>
                                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', padding: '4px' }}>
                                                {date}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#aa8c15' }}>
                                                เวลา
                                            </Typography>
                                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', padding: '4px' }}>
                                                {time}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#aa8c15' }}>
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
                                <Typography variant="h5" gutterBottom color={'black'} fontWeight={'bold'}>
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
                                                <Autocomplete
                                                    id="province-select"
                                                    options={province}
                                                    name="province"
                                                    getOptionLabel={(option) => option.label}
                                                    renderInput={(params) => <TextField {...params} label="จังหวัด" />}
                                                    value={province.find(p => p.value === checkoutData.province_id) || null}
                                                    onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "province_id")}
                                                    fullWidth
                                                    disableListWrap
                                                    ListboxProps={{
                                                        style: {
                                                            maxHeight: '250px',
                                                            overflow: 'auto',
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>เขต / อำเภอ</Typography>
                                            <Box marginTop={'16px'}>
                                                <Autocomplete
                                                    id="district-select"
                                                    options={district}
                                                    name="district"
                                                    getOptionLabel={(option) => option.label}
                                                    renderInput={(params) => <TextField {...params} label="เขต / อำเภอ" />}
                                                    value={district.find(p => p.value === checkoutData.district_id) || null}
                                                    onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "district_id")}
                                                    fullWidth
                                                    ListboxProps={{
                                                        style: {
                                                            maxHeight: '250px',
                                                            overflow: 'auto',
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>แขวน / ตำบล</Typography>
                                            <Box marginTop={'16px'}>
                                                <Autocomplete
                                                    id="subdistrict-select"
                                                    options={subdistrict}
                                                    name="SubDistrict"
                                                    getOptionLabel={(option) => option.label}
                                                    renderInput={(params) => <TextField {...params} label="แขวน / ตำบล" />}
                                                    value={subdistrict.find(p => p.value === checkoutData.subdistrict_id) || null}
                                                    onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "subdistrict_id")}
                                                    fullWidth
                                                    ListboxProps={{
                                                        style: {
                                                            maxHeight: '250px',
                                                            overflow: 'auto',
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{ marginBottom: '8px' }}>รหัสไปรษณีย์</Typography>
                                            <Box marginTop={'16px'}>
                                                <Autocomplete
                                                    id="zip_code"
                                                    options={zip_code}
                                                    name="zip_code"
                                                    getOptionLabel={(option) => option.zip_code}
                                                    renderInput={(params) => <TextField {...params} label="รหัสไปรษณีย์" />}
                                                    onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "zip_code")}
                                                    fullWidth
                                                    ListboxProps={{
                                                        style: {
                                                            maxHeight: '250px',
                                                            overflow: 'auto',
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography>จุดประสงค์การจอง</Typography>
                                            <Box marginTop={'16px'}>
                                                <TextField
                                                    name="note"
                                                    margin='16px'
                                                    fullWidth
                                                    label="จุดประสงค์การจอง"
                                                    variant="outlined"
                                                    value={checkoutData.note}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                            <CardContent>
                                <Typography variant="h5" gutterBottom color={'black'} fontWeight={'bold'}>
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
                        </Card>
                        <Card sx={{ width: '30%', height: '44vh', boxShadow: 5, padding: 2 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight={'bold'}>
                                    สรุปยอดชำระเงิน
                                </Typography>
                            </CardContent>
                            <Box display="flex" flexDirection="row" gap={2} justifyContent={'space-between'} padding={2}>
                                <Box>
                                    <Typography gutterBottom fontWeight={'bold'} color={'#1a237e'} fontSize={'20px'}>
                                        ราคารวม
                                    </Typography>
                                    <Typography gutterBottom>
                                        (ไม่รวมภาษีมูลค่าเพิ่ม)
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography gutterBottom fontWeight={'bold'} color={'#1a237e'} fontSize={'20px'}>
                                        {total_price} บาท
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" flexDirection="row" gap={2} justifyContent={'space-between'} padding={2}>
                                <Box>
                                    <Typography gutterBottom fontWeight={'bold'} color={'#1a237e'} fontSize={'20px'} >
                                        ภาษีมูลค่าเพิ่ม
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography gutterBottom fontWeight={'bold'} color={'#1a237e'} fontSize={'20px'}>
                                        {vat} บาท
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider />
                            <Box display="flex" flexDirection="row" gap={2} justifyContent={'space-between'} padding={2}>
                                <Box>
                                    <Typography gutterBottom fontWeight={'bold'} color={'#1a237e'} fontSize={'20px'}>
                                        ราคารวม
                                    </Typography>
                                    <Typography gutterBottom>
                                        (รวมภาษีมูลค่าเพิ่ม)
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography gutterBottom fontWeight={'bold'} color={'#1a237e'} fontSize={'20px'}>
                                        {total_price + vat} บาท
                                    </Typography>
                                </Box>
                            </Box>
                            <Box >
                                <Button
                                    sx={{
                                        bgcolor: "#1a237e",
                                        width: "100%",
                                        borderRadius: 1,
                                        color: 'white',
                                        boxShadow: 4,
                                        '&.Mui-disabled': {
                                            bgcolor: "#A9A9A9", // Set a lighter color when disabled
                                            color: "white",     // Keep the text color white or adjust as needed
                                            opacity: 0.5        // Make the button look faded
                                        }
                                    }}
                                    onClick={handleSubmitted}
                                // Set to true to disable the button
                                >
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