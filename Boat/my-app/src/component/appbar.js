import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import  Cookies  from 'js-cookie';


const AppBarComponent = () => {

    const navigate = useNavigate();
    const token = Cookies.get('token');
    const firstName = Cookies.get('first_name');
    const lastName = Cookies.get('last_name');

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  }

  return (
    <Box sx={{ flexGrow: 1 ,zIndex:999}}>
      <AppBar position="static" color="transparent" sx={{ boxShadow: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img
              src="https://ik.imagekit.io/tvlk/image/imageResource/2023/06/29/1688022859636-852e89a793fd448275fdc71c91824f06.png?tr=q-75"
              alt="Logo"
              style={{ height: '40px' }}
            />
          </Typography>
          <Button color="inherit" component={Link} to="/">
            หน้าหลัก
            </Button>
          <Button color="inherit" component={Link} to="/admin/checkin">
            check In
          </Button>
          <Button color="inherit" component={Link} to="/admin">
            Admin
          </Button>
          <Box sx={{width:'300px'}}>
            <Button
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              fullWidth
            >
              <img
                src="https://today-obs.line-scdn.net/0hQIzXipbFDmZHIR1ylFFxMX93Ahd0RxRvZUZHBjYoV1FiDR0yLERdBWcjBUpiEUFnZ0REBGB1V184Eks1KA/w644"
                alt="User"
                style={{ width: '46px', height: '46px', borderRadius: '50%' , marginRight:4}}
              />
              <Typography>{firstName} {lastName}</Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            width: '200px',
            marginTop: '8px',
          },
        }}
      >
        {/* <MenuItem onClick={() => console.log("test")}>โปรไฟล์</MenuItem> */}
        <MenuItem onClick={()=>navigate('/admin/register')}>เพิ่มบัญชี</MenuItem>
        {/* <MenuItem onClick={() => console.log("test")}>การตั้งค่าบัญชี</MenuItem> */}
        <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>
      </Menu>
    </Box>
  );
};

export default AppBarComponent;