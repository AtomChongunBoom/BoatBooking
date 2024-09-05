import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Link,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { UserLogin } from '../../service/user_service';
import { AlertError } from '../../component/popupAlert';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LoginPage = () => {

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [userdata, setUserData] = React.useState({
    username:'',
    password: ''
  });

  const handleLogin = async (req, res) => {
    if(userdata.password && userdata.username){
      try {
        const token = await UserLogin(userdata)
        if(token){
          Cookies.set('token', token, { expires: 7 });
          navigate('/admin')
        }
      }catch(err) {
        AlertError('ล็อกอินผิดพลาด', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      }
    }else{
      AlertError('ล็อกอินผิดพลาด','กรุณากรอกข้อมูล')
      return;
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: '100vh',
      bgcolor: '#1976d2',
      color: 'white',
    }}>
      <Box sx={{
        flex: isMobile ? 'none' : 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        p: isMobile ? 2 : 4,
        textAlign: isMobile ? 'center' : 'left',
      }}>
        <Typography variant={isMobile ? "h4" : "h3"} component="h1" gutterBottom>
          WELCOME
        </Typography>
        <Typography variant={isMobile ? "h5" : "h4"} component="h2" gutterBottom>
          TicketShare Boat Rental Admin
        </Typography>
        <Box sx={{ maxHeight: '40%', overflowY: 'auto' }}>
          <Typography variant="body1">
            ระบบการจัดการเช่าเรือแบบ Share Ticket ที่ออกแบบมาเพื่อการบริหารจัดการโดยเฉพาะ
            คุณสามารถจัดการข้อมูลการจองตั๋วแบบแชร์
          </Typography>
        </Box>
      </Box>
      <Box sx={{
        width: isMobile ? '100%' : 500,
        bgcolor: 'white',
        p: isMobile ? 2 : 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Typography variant="h5" component="h2" gutterBottom color={'#1976d2'} fontWeight={'bold'} fontSize={'32px'}>
          Sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          สำหรับ Admin หรือ Sale เท่านั้น!
        </Typography>
        <TextField label="User Name" variant="outlined" margin="normal" fullWidth  value={userdata.username} name="username" onChange={handleChange}/>
        <TextField label="Password" type="password" variant="outlined" margin="normal" fullWidth value={userdata.password} name="password" onChange={handleChange} />
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          my: 2
        }}>
          <Box></Box>
          <Link href="#" variant="body2" sx={{ mt: isMobile ? 1 : 0 }}>Forgot Password?</Link>
        </Box>
        <Button variant="contained" color="primary" size="large" fullWidth onClick={handleLogin}>
          Sign in
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;