/* global Omise */
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { getProvince, getDistricts, getSubDistrict, getZipCode } from '../../../service/utinity_service';
import { AlertError, AlertLoading, AlertSuccess } from '../../../component/popupAlert';

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
import { tr } from 'date-fns/locale';


const CheckoutView = () => {

    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [province, setProvince] = useState([])
    const [district, setDistrict] = useState([])
    const [subdistrict, setSubdistrict] = useState([])
    const [districtDefaut, setDistrictDefaut] = useState([])
    const [subdistrictDefaut, setSubdistrictDefaut] = useState([])
    const [zip_code, setZipCode] = useState([])
    const [AutocompleteState, setAutocomplateState] = useState({
        district: false, setDistrict: false, zip_code: false
    }) //

    const [checkoutData, setCheckoutData] = useState({})
    const [checkboxValues, setCheckboxValues] = useState({
        serviceTerms: false,
        personalData: false,
        serviceUpdates: false
    });

    const [dataFetched, setDataFetched] = useState(false);
    const [formattedData, setFormattedData] = useState('')
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


        let vat = (total_price * 7) / 100
        vat = parseInt(vat, 10);

        setCheckoutData({
            id:uuidv4(),
            adults: adults,
            children: children,
            time: time,
            date: date,
            total_price: total_price+vat,
            total_people: adults + children,
            vat: vat,
            amount: total_price,
            creat_date: new Date().toISOString()
        })
        const resDate = format(new Date(date), 'dd/MM/yyyy');
        setFormattedData(resDate);
        // }
    }, []);

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
        setDataFetched(true);
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
        setCheckoutData(prevData => ({
            ...prevData,
            [name]: value
        }));
        console.log(checkoutData)
    };

    const validateBookingData = (data) => {
        const requiredFields = [
            'date', 'time', 'adults', 'children', 'total_people', 'vat', 'amount', 'total_price',
            'first_name', 'last_name', 'email', 'tel', 'address', 'province', 'district', 'subdistrict', 'zip_code'
        ];

        const emptyFields = requiredFields.filter(field => {
            const value = data[field];
            return value === undefined || value === null || value === '' ||
                (typeof value === 'number' && isNaN(value));
        });

        if (emptyFields.length > 0) {
            return {
                isValid: false,
                emptyFields: emptyFields
            };
        }

        return { isValid: true };
    };

    const formatDate = (dateString) => {
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
          }
          
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
          const year = date.getFullYear();
          
          return `${day}-${month}-${year}`;
        } catch (error) {
          throw new Error('Invalid date format. Please enter a valid date.');
        }
      };


    const handleSubmitted = async () => {
        //loading
        AlertLoading()
        try {
            // Check if all checkboxes are checked
            if (!Object.values(checkboxValues).every(value => value === true)) {
                throw new Error('กรุณากดยอมรับเงื่อนไข');
            }

            const result = formatDate(checkoutData.date);
            checkoutData.date = result;
            console.log('Checked data',checkoutData)
            const validationResult = validateBookingData(checkoutData);
            if (!validationResult.isValid) {
                throw new Error(`กรุณากรอกข้อมูลให้ครบถ้วน: ${validationResult.emptyFields.join(', ')}`);
            }

            //Add ticket boat
            await AddTicketboat(checkoutData);

            //Send email
            await SendEmail(checkoutData);

            //Create Omise source
            const omiseRes = await CreateSource(checkoutData.amount);

            //Get payment
            const paymentData = {
                "ticketID": checkoutData.id,
                "source": omiseRes.id,
                "amount": checkoutData.amount,
            };
            const paymentState = await Getpayment(paymentData);

            // Remove cookies
            ['adults', 'children', 'time', 'total_prices', 'date'].forEach(cookie => Cookies.remove(cookie));

            // Show success message
            AlertSuccess('สำเร็จ', 'ข้อมูลการจองของคุณถูกบันทึกเรียบร้อยแล้ว');

            // Redirect to payment page
            window.location.href = paymentState.redirectUrl;

        } catch (error) {
            console.error('Error in handleSubmitted:', error);
            AlertError('เกิดข้อผิดพลาด', error.message);
        }
    };


    const handleChangeAutocomplate = async (event, newValue, name) => {
        if (newValue) {
            setCheckoutData(prevData => {
                const newData = { ...prevData };
                if (name === 'zip_code') {
                    newData[name] = newValue.zip_code;
                } else if (name === 'subdistrict') {
                    newData[name] = newValue.value;
                    newData["zip_code"] = ""
                    const currentSubdistricts = subdistrictDefaut.filter(d => newValue.value === d.value);
                    setZipCode(currentSubdistricts);  // Set zip code based on the current subdistrict
                    setAutocomplateState({province: true, district: true, setDistrict: true, zip_code: true});
                } else if (name === "province") {
                    newData[name] = newValue.value;
                    newData["district"] = null
                    newData["subdistrict"] = null
                    newData["zip_code"] = null
                    setDistrict(districtDefaut.filter(d => newValue.value === d.province_id));
                    setAutocomplateState({
                        province: true,
                        district: true,
                        subdistrict: false,
                        zip_code: false
                    });
                } else if (name === "district") {
                    newData[name] = newValue.value;
                    newData["subdistrict"] = null
                    newData["zip_code"] = null
                    setSubdistrict(subdistrictDefaut.filter(d => newValue.value === d.district_id));
                    setAutocomplateState({province: true, district: true, setDistrict: true, zip_code: false});
                }
                return newData;
            });
        }
        console.log(checkoutData)
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
                                                {formattedData}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#aa8c15' }}>
                                                เวลา
                                            </Typography>
                                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', padding: '4px' }}>
                                                {checkoutData.time}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#aa8c15' }}>
                                                จำนวนผู้โดยสาร
                                            </Typography>
                                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', padding: '4px' }}>
                                                ผู้ใหญ่ {checkoutData.adults}  คน และ เด็ก {checkoutData.children} คน
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
                                                    name="first_name"
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
                                                    name="last_name"
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
                                                    name="tel"
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
                                                    value={province.find(p => p.value === checkoutData.province) || null}
                                                    onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "province")}
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
                                                    value={district.find(p => p.value === checkoutData.district) || null}
                                                    onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "district")}
                                                    fullWidth
                                                    ListboxProps={{
                                                        style: {
                                                            maxHeight: '250px',
                                                            overflow: 'auto',
                                                        },
                                                    }}
                                                    disabled={!AutocompleteState.district}
                                                    sx={{
                                                        '&.Mui-disabled': {
                                                            backgroundColor: '#bdbdbd',
                                                        },
                                                        '& .MuiInputBase-root.Mui-disabled': {
                                                            backgroundColor: '#bdbdbd',
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
                                                    value={subdistrict.find(p => p.value === checkoutData.subdistrict) || null}
                                                    onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "subdistrict")}
                                                    fullWidth
                                                    ListboxProps={{
                                                        style: {
                                                            maxHeight: '250px',
                                                            overflow: 'auto',
                                                        },
                                                    }}
                                                    disabled={!AutocompleteState.setDistrict}
                                                    sx={{
                                                        '&.Mui-disabled': {
                                                            backgroundColor: '#bdbdbd',
                                                        },
                                                        '& .MuiInputBase-root.Mui-disabled': {
                                                            backgroundColor: '#bdbdbd',
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
                                                    renderInput={(params) => <TextField {...params} label="รหัสไปรษณีย์"  name='zip_code' />}
                                                    onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "zip_code")}
                                                    fullWidth
                                                    ListboxProps={{
                                                        style: {
                                                            maxHeight: '250px',
                                                            overflow: 'auto',
                                                        },
                                                    }}
                                                    disabled={!AutocompleteState.zip_code}
                                                    sx={{
                                                        '&.Mui-disabled': {
                                                            backgroundColor: '#bdbdbd',
                                                        },
                                                        '& .MuiInputBase-root.Mui-disabled': {
                                                            backgroundColor: '#bdbdbd',
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
                                        {checkoutData.amount} บาท
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
                                        {checkoutData.vat} บาท
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
                                        {checkoutData.total_price || 0} บาท
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