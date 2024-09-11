import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Grid,
    IconButton,
    InputAdornment,
    Card,
    Select, MenuItem, InputLabel, FormControl, Autocomplete
} from '@mui/material';
import { MdMoreVert } from "react-icons/md";
import AppBarComponent from '../../../component/appbar';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoTicketOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaSquarePhone } from "react-icons/fa6";
import Cookies from 'js-cookie'
import { getBookingByID, UpdateBooking } from '../../../service/booking_service';
import { getProvince, getDistricts, getSubDistrict, getZipCode } from '../../../service/utinity_service';

import dayjs from 'dayjs';
import { AlertError, AlertLoading, AlertSuccess } from '../../../component/popupAlert';


const TicketForm_View = () => {

    const navigate = useNavigate()
    const { id } = useParams();

    const steps = ['รอชำระเงิน', 'ชำระเงินแล้ว', 'รอให้บริการ', 'เสร็จสิ้น'];
    const [activeStep, setActiveStep] = useState(0);

    const subdistricts = ["Subdistrict 1", "Subdistrict 2", "Subdistrict 3"];
    const districts = ["District 1", "District 2", "District 3"];
    const provinces = ["Province 1", "Province 2", "Province 3"];
    const zipCodes = ["10000", "20000", "30000"];

    const [BookingData, setBookingData] = useState({
        first_name: "",
        last_name: "",
        address: "",
        subdistrict: "",
        district: "",
        province: "",
        zipCode: "",
        email: "",
        phone: "",
        time: "",
        ticketDate: "",
        adults: "0",
        children: "0",
        total: "0"
    });

    const timeSlots = ['9:00 - 10:30', '10:00 - 11:30', '11:00 - 12:30', '12:00 - 13:30', '13:00 - 14:30', '13:30 - 15:00'];
    const token = Cookies.get('token');
    const [province, setProvince] = useState([])
    const [district, setDistrict] = useState([])
    const [subdistrict, setSubdistrict] = useState([])
    const [districtDefaut, setDistrictDefaut] = useState([])
    const [subdistrictDefaut, setSubdistrictDefaut] = useState([])
    const [zip_code, setZipCode] = useState([])
    const [autocompleteState, setAutocomplateState] = useState({
        district: false, setDistrict: false, zip_code: false
    }) //
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        handleGetBookingById()
        init();
    }, []);

    const init = async () => {
        try {

            const responseProvince = await getProvince();
            setProvince(responseProvince);

            let responseAmphur = await getDistricts();
            console.log("BookingData.province : ",BookingData.province)
            if (BookingData.province) {
                responseAmphur = responseAmphur.filter(d => BookingData.province == d.province_id)
                setDistrict(responseAmphur)
            }
            setDistrictDefaut(responseAmphur);
            const responseSubDistrict = await getSubDistrict();
            if (BookingData.district) {
                if (BookingData.province) {
                    responseSubDistrict = responseSubDistrict.filter(d => BookingData.province == d.province_id)
                    setDistrict(responseSubDistrict)
                }
                setSubdistrict(responseSubDistrict)
            }
            setSubdistrictDefaut(responseSubDistrict);

        } catch (error) {
            console.error("Error during initialization:", error);
        }
    };


    const handleGetBookingById = async () => {
        console.log(id)
        const response = await getBookingByID({ id: id, token: token })
        console.log("tset",response);
        setBookingData(response.data);
        const currentStepIndex = steps.findIndex(step => step === response.data.status);
        setActiveStep(currentStepIndex);
    }

    const handleUpdate = async () => {
        try {
            const res = await UpdateBooking(BookingData, token);
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBookingData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        setBookingData(prevState => ({
            ...prevState,
            total_people: parseInt(prevState.adults || 0, 10) + parseInt(prevState.children || 0, 10)
        }));
    }, [BookingData.adults,BookingData.children]);
    

    const handleChangeAutocomplate = async (event, newValue, name) => {
        if (newValue) {
            setBookingData(prevData => {
                const newData = { ...prevData };
                if (name === 'zip_code') {
                    newData[name] = newValue.zip_code;
                } else if (name === 'subdistrict') {
                    newData[name] = newValue.value;
                    newData["zip_code"] = ""
                    const currentSubdistricts = subdistrictDefaut.filter(d => newValue.value === d.value);
                    setZipCode(currentSubdistricts);  // Set zip code based on the current subdistrict
                    setAutocomplateState({ province: true, district: true, setDistrict: true, zip_code: true });
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
                    setAutocomplateState({ province: true, district: true, setDistrict: true, zip_code: false });
                }
                return newData;
            });
        }
        console.log(BookingData)
    };

    const handleSubmit = () => {
        if(BookingData.total_people > 5){
            AlertError('แก้ไขข้อมูลผิดพลาด','มีจำนวนผู้โดยสารได้ไม่เกิน 5 คน')
            return;
        }
        AlertLoading()
        try {
            handleUpdate();
            AlertSuccess('อัพเดทข้อมูลสำเร็จ')
        }catch (err) {
            AlertError('การแก้ไขผิดพลาด')
        }
    };

    const formatInputDate = (date) => {
        if (!date) return '';
        // แปลงค่าจาก DD-MM-YYYY เป็น YYYY-MM-DD
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
      };

    return (
        <Box>
            <AppBarComponent />
            <Box sx={{ display: 'flex', height: 'auto', bgcolor: 'white', margin: 1 }}>
                <Paper
                    elevation={3}
                    sx={{
                        m: 'auto',
                        width: '90%',
                        maxWidth: 2000,
                        height: '90%',
                        p: 3,
                        borderRadius: 4,
                        display: 'flex',
                    }}
                >
                    <Box sx={{ width: '25%', borderRight: '1px solid #e0e0e0', pr: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                            Ticket number : {BookingData.booking_id}
                            <IconButton size="medium" sx={{ ml: 1 }}>
                                <IoTicketOutline />
                            </IconButton>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search"
                            sx={{ mb: 3 }}
                        />
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Registration
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {['Personal details', 'Family', 'Professional details', 'Review & confirm'].map(

                                (item, index) => (
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Test</Typography>
                                        <Box
                                            key={item}
                                            sx={{
                                                height: index === 0 ? 6 : 4,
                                                bgcolor: index === 0 ? '#1976d2' : '#e0e0e0',
                                                borderRadius: 1,
                                            }}
                                        />
                                    </Box>
                                )
                            )}
                        </Box>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 'auto', mb: 1 }}
                        >
                            Email gmail.common@gmail.com
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                        >
                            Call : 0626209688
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, pl: 3 }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Status Ticket
                        </Typography>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Card sx={{ padding: 2, margin: 2, boxShadow: 4 }} >
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Customer Information
                                <IconButton size="small">
                                    <IoMdInformationCircleOutline />
                                </IconButton>
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>First Name</Typography>
                                    <TextField
                                        fullWidth
                                        name="first_name"
                                        label="First Name"
                                        required
                                        value={BookingData.first_name}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>Last Name</Typography>
                                    <TextField
                                        fullWidth
                                        name="last_name"
                                        label="Last Name"
                                        required
                                        value={BookingData.last_name}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} marginTop={'2px'}>
                                <Grid item xs={12}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>Address</Typography>
                                    <TextField
                                        fullWidth
                                        name="address"
                                        label="Address"
                                        required
                                        value={BookingData.address}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} marginTop={'2px'}>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>Province</Typography>
                                    {/* <FormControl fullWidth required>
                                        <InputLabel>Subdistrict</InputLabel>
                                        <Select
                                            name="subdistrict"
                                            label="Subdistrict"
                                            value={BookingData.subdistrict}
                                            onChange={handleChange}
                                        >
                                            {subdistricts.map((subdistrict, index) => (
                                                <MenuItem key={index} value={subdistrict}>{subdistrict}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}
                                    <Autocomplete
                                        id="province-select"
                                        options={province}
                                        name="province"
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} label="จังหวัด" />}
                                        value={province.find(p => p.value == BookingData.province) || null}
                                        onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "province")}
                                        fullWidth
                                        disableListWrap
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                        ListboxProps={{
                                            style: {
                                                maxHeight: '250px',
                                                overflow: 'auto',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>District</Typography>
                                    {/* <FormControl fullWidth required>
                                        <InputLabel>Subdistrict</InputLabel>
                                        <Select
                                            name="subdistrict"
                                            label="Subdistrict"
                                            value={BookingData.subdistrict}
                                            onChange={handleChange}
                                        >
                                            {subdistricts.map((subdistrict, index) => (
                                                <MenuItem key={index} value={subdistrict}>{subdistrict}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}
                                    <Autocomplete
                                        id="province-select"
                                        options={districtDefaut}
                                        name="province"
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} label=" เขต / อำเภอ" />}
                                        value={districtDefaut.find(p => p.value == BookingData.district) || null}
                                        onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "province")}
                                        fullWidth
                                        disableListWrap
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                        ListboxProps={{
                                            style: {
                                                maxHeight: '250px',
                                                overflow: 'auto',
                                            },
                                        }}
                                    />

                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>Subdistrict</Typography>
                                    {/* <FormControl fullWidth required>
                                        <InputLabel>Subdistrict</InputLabel>
                                        <Select
                                            name="subdistrict"
                                            label="Subdistrict"
                                            value={BookingData.subdistrict}
                                            onChange={handleChange}
                                        >
                                            {subdistricts.map((subdistrict, index) => (
                                                <MenuItem key={index} value={subdistrict}>{subdistrict}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}
                                    <Autocomplete
                                        id="province-select"
                                        options={subdistrictDefaut}
                                        name="province"
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} label=" ตำบล" />}
                                        value={subdistrictDefaut.find(p => p.value == BookingData.subdistrict) || null}
                                        onChange={(e, newValue) => handleChangeAutocomplate(e, newValue, "subdistrict")}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                        disableListWrap
                                        ListboxProps={{
                                            style: {
                                                maxHeight: '250px',
                                                overflow: 'auto',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>zip_code</Typography>
                                    <FormControl fullWidth required>
                                        <InputLabel>zip_code</InputLabel>
                                        <Select
                                            name="zip"
                                            label="Subdistrict"
                                            value={BookingData.subdistrict}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink: true,
                                              }}
                                        >
                                            {subdistricts.map((subdistrict, index) => (
                                                <MenuItem key={index} value={subdistrict}>{subdistrict}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} marginTop={'2px'}>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>Email</Typography>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        label="Email"
                                        required
                                        placeholder="Email"
                                        value={BookingData.email}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdEmail fontSize={'24px'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>Phone</Typography>
                                    <TextField
                                        fullWidth
                                        name="tel"
                                        label="Phone"
                                        required
                                        placeholder="Phone"
                                        value={BookingData.tel}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FaSquarePhone fontSize={'24px'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                        <Card sx={{ padding: 2, margin: 2, boxShadow: 4 }}>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Ticket details
                                <IconButton size="small">
                                    <IoMdInformationCircleOutline />
                                </IconButton>
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>Date</Typography>
                                    <TextField
                                        fullWidth
                                        name="ticketDate"
                                        label="Date"
                                        type="date"
                                        value={BookingData.date}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>Time</Typography>
                                    <FormControl fullWidth required>
                                        <InputLabel>Time</InputLabel>
                                        <Select
                                            name="time"
                                            label="Time"
                                            value={BookingData.time}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink: true,
                                              }}
                                        >
                                            {timeSlots.map((timeSlots, index) => (
                                                <MenuItem key={index} value={timeSlots}>{timeSlots}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} marginTop={'2px'}>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>ผู้ใหญ่</Typography>
                                    <TextField
                                        fullWidth
                                        name="adults"
                                        label="Adults"
                                        value={BookingData.adults}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">คน</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>เด็ก</Typography>
                                    <TextField
                                        fullWidth
                                        name="children"
                                        label="Children"
                                        value={BookingData.children}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">คน</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ marginBottom: 2, fontSize: '18px' }}>จำนวนผู้โดยสารทั้งหมด</Typography>
                                    <TextField
                                        fullWidth
                                        name="total"
                                        label="Total"
                                        value={BookingData.total_people}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">คน</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Button variant="outlined" sx={{ margin: 1, width: '200px' }} onClick={() => navigate('/admin')}>Back</Button>
                            <Button variant="contained" sx={{ margin: 1, width: '200px' }} onClick={(e) => handleSubmit(e)}>Save</Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default TicketForm_View;