import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import BookingView from './page/Booking/booking_view';
import CSMTable from './page/CSM/manage_view';
import CandidateBooking from './page/CSM/edit/editBooking_view';
import Checkout from './page/Booking/test_view';
import PaymentSuccessPage from './page/Booking/s/paymentSuccess';
import CheckoutView from './page/Booking/Checkout/checkout';
function App() {
  return (
    <Router>
      <AppBar position="static" color="transparent" sx={{zIndex:999,position:'fixed',x:0,y:0 ,bgcolor:'white'}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img 
                src="https://ik.imagekit.io/tvlk/image/imageResource/2023/06/29/1688022859636-852e89a793fd448275fdc71c91824f06.png?tr=q-75" 
                alt="Logo" 
                style={{ height: '40px' }} // Adjust the height as needed
              />
            </Typography>
          <Button color="inherit" component={Link} to="/" >หน้าหลัก</Button>
          <Button color="inherit" component={Link} to="/admin">Admin</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<BookingView />} />
        <Route path="/admin" element={<CSMTable />} />
        <Route path="/admin/edit" element={<CandidateBooking />} />
        <Route path="/payment" element={<Checkout />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/checkout" element={<CheckoutView />} />
      </Routes>
    </Router>
  );
}

export default App;
