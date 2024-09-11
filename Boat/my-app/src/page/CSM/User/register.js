import React, { useState ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    MenuItem,
    Grid,
    Typography,
    Container,
    Paper,
    Divider,
    Button,IconButton
} from '@mui/material';
import AppBarComponent from '../../../component/appbar';
import { UserRegister } from '../../../service/user_service';
import { AlertError, AlertLoading, AlertSuccess } from '../../../component/popupAlert';
import { CloudUpload } from '@mui/icons-material';

const Resgiter_view = () => {

    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const initialUserData = {
        user_id: '',
        username: '',
        password: '',
        email: '',
        tel: '',
        role: '',
        first_name: '',
        last_name: '',
        gender: '',
        birthDate: '',
        birthMonth: '',
        birthYear: '',
        date_of_birth: '',
    };

    const [userData, setUserData] = useState(initialUserData);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevData => {
            const updatedData = { ...prevData, [name]: value };

            // Combine birth date fields if all are present
            if (['birthDate', 'birthMonth', 'birthYear'].includes(name)) {
                const { birthDate, birthMonth, birthYear } = updatedData;
                if (birthDate && birthMonth && birthYear) {
                    updatedData.date_of_birth = `${birthDate}-${birthMonth}-${birthYear}`;
                }
            }

            return updatedData;
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData(prevData => ({
                    ...prevData,
                    profile_picture_url: reader.result,
                    profile_image_name: file.name
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        // if (isValidForm()) {
        //     console.log('Form submitted:', userData);
        //     // Here you can add your logic to send the data to a server or perform other actions
        // } else {
        //     console.log('Form is invalid');
        //     // You might want to show an error message to the user here
        // }
        AlertLoading()
        try {
            handleRegister();
            handleReset();
            AlertSuccess('สร้างบัญชีสำเร็จ');
        } catch (e) {
            AlertError('เกิดข้อผิดพลาด', e)
        }

    };

    const handleReset = () => {
        setUserData(initialUserData);
    };

    const handleRegister = async () => {
        const res = await UserRegister(userData)
    };

    return (
        <Box>
            <AppBarComponent />
            <Box>
                <Container maxWidth="lg" margin={4}>
                    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom fontWeight={'bold'}>
                            สร้างบัญชีพนักงาน
                        </Typography>

                        <Box component="form" noValidate sx={{ mt: 3 }}>
                            <Box paddingBottom={4}>
                                <Typography variant="body2" sx={{ bgcolor: 'warning.light', p: 2, mb: 2 }}>
                                    บันทึกข้อความ: กรุณาตรวจสอบข้อมูลให้ถูกต้อง
                                </Typography>

                                <Typography variant="h6" component="h1" gutterBottom fontWeight={'bold'}>
                                    ระบุข้อมูลพนักงาน
                                </Typography>

                                <Divider />

                                <Grid container spacing={2} marginTop={1}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            username
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="username"
                                            name="username"
                                            value={userData.username}
                                            onChange={handleChange}
                                            required
                                            margin="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            password
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="password"
                                            name="password"
                                            value={userData.password}
                                            onChange={handleChange}
                                            required
                                            margin="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            รหัสพนักงาน
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="รหัสพนักงาน"
                                            name="user_id"
                                            value={userData.user_id}
                                            onChange={handleChange}
                                            required
                                            margin="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            ตำแหน่ง
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            label="ตำแหน่ง"
                                            name="role"
                                            value={userData.role}
                                            onChange={handleChange}
                                            required
                                            margin="small"
                                        >
                                            {['sale', 'Admin'].map((position) => (
                                                <MenuItem key={position} value={position}>{position}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>



                                <Typography variant="h6" component="h1" gutterBottom fontWeight={'bold'} marginTop={4}>
                                    ระบุข้อมูลพนักงาน
                                </Typography>

                                <Divider />

                                <Grid container spacing={2} marginTop={1}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            คำนำหน้า
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            label="คำนำหน้า"
                                            name="prefix"
                                            value={userData.prefix}
                                            onChange={handleChange}
                                            required
                                            margin="small"
                                        >
                                            <MenuItem value="นาย">นาย</MenuItem>
                                            <MenuItem value="นาง">นาง</MenuItem>
                                            <MenuItem value="นางสาว">นางสาว</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            ชื่อจริง
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="ชื่อจริง"
                                            name="first_name"
                                            value={userData.first_name}
                                            onChange={handleChange}
                                            required
                                            margin="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            นามสกุล
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="นามสกุล"
                                            name="last_name"
                                            value={userData.last_name}
                                            onChange={handleChange}
                                            required
                                            margin="small"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            เพศ
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            label="เพศ"
                                            name="gender"
                                            value={userData.gender}
                                            onChange={handleChange}
                                            required
                                            margin="small"
                                        >
                                            <MenuItem value="ชาย">ชาย</MenuItem>
                                            <MenuItem value="หญิง">หญิง</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} marginTop={1}>
                                    {/* <Grid item xs={12} sm={4}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            วันเกิด
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            label="วัน"
                                            name="birthDate"
                                            value={userData.birthDate}
                                            onChange={handleChange}
                                            margin="small"

                                        >
                                            {[...Array(31)].map((_, i) => (
                                                <MenuItem key={i} value={(i + 1).toString().padStart(2, '0')}>{i + 1}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            เดือนเกิด
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            label="เดือน"
                                            name="birthMonth"
                                            value={userData.birthMonth}
                                            onChange={handleChange}
                                            margin="small"
                                        >
                                            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((month, index) => (
                                                <MenuItem key={index} value={month}>{['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                                                    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][index]}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            ปีเกิด
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            label="ปี"
                                            name="birthYear"
                                            value={userData.birthYear}
                                            onChange={handleChange}
                                            margin="small"
                                        >
                                            {[...Array(100)].map((_, i) => (
                                                <MenuItem key={i} value={(2024 - i).toString()}>{2024 - i}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid> */}

                                    {/* <Grid item xs={12} sm={4}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            อัพโหลดรูปโปรไฟล์
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton onClick={() => fileInputRef.current.click()}>
                                                        <CloudUpload />
                                                    </IconButton>
                                                ),
                                                readOnly: true,
                                            }}
                                            value={userData.profile_image_name || ''}
                                            placeholder="เลือกไฟล์รูปภาพ"
                                        />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                        />
                                    </Grid> */}
                                </Grid>

                                <Typography variant="h6" component="h1" gutterBottom fontWeight={'bold'} marginTop={4}>
                                    ระบุข้อมูลสำหรับติดต่อ
                                </Typography>

                                <Divider />

                                <Grid container spacing={2} marginTop={1}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            อีเมล
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            required
                                            margin="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography gutterBottom sx={{ fontSize: '18px' }}>
                                            เบอร์โทรศัพท์
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="เบอร์โทรศัพท์"
                                            name="tel"
                                            value={userData.tel}
                                            onChange={handleChange}
                                            required
                                            margin="small"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                            <Button
                                variant="contained"
                                onClick={()=>navigate('/admin')}
                                sx={{ mr: 1, height: '40px', bgcolor: 'black', color: 'white' }}
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={false}
                                sx={{ ml: 1, height: '40px', width: '200px' }}
                            >
                                ยืนยัน
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default Resgiter_view;