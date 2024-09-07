import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import BookingView from './page/Booking/booking_view';
import CSMTable from './page/CSM/manage_view';
import CandidateBooking from './page/CSM/edit/editBooking_view';
import Checkout from './page/Booking/test_view';
import PaymentSuccessPage from './page/Booking/Success/paymentSuccess';
import CheckoutView from './page/Booking/Checkout/checkout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from './page/Login/login_view';
import Dashboard from './page/CSM/DashBord/dashbord';
import Resgiter_view from './page/CSM/User/register';
function App() {

  const theme = createTheme({
    typography: {
      fontFamily: 'Prompt, sans-serif',
    },
    // คุณสามารถปรับแต่งอื่นๆ ในธีมนี้ได้เช่นกัน เช่นสีหลัก (palette)
  });
  return (
    <ThemeProvider theme={theme}>
      <Router>
        {/* <AppBar position="static" color="transparent" sx={{zIndex:999,position:'fixed',x:0,y:0 ,bgcolor:'white'}}> */}
        {/* <AppBar position="static" color="transparent" sx={{boxShadow:2}} >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img
                src="https://ik.imagekit.io/tvlk/image/imageResource/2023/06/29/1688022859636-852e89a793fd448275fdc71c91824f06.png?tr=q-75"
                alt="Logo"
                style={{ height: '40px' }} // Adjust the height as needed
              />
            </Typography>
            <Button color="inherit" component={Link} to="/" >หน้าหลัก</Button>
            <Button color="inherit" component={Link} to="/login">Admin</Button>
          </Toolbar>
        </AppBar> */}
        <Routes>
          <Route path="/" element={<BookingView />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<CSMTable />} />
          <Route path="/admin/register" element={<Resgiter_view />} />
          <Route path="/admin/edit/:id" element={<CandidateBooking />} />
          
          <Route path="/payment" element={<Checkout />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/checkout" element={<CheckoutView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
