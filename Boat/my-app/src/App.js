import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import BookingView from './page/Booking/booking_view';
import CSMTable from './page/CSM/manage_view';
import CandidateBooking from './page/CSM/edit/editBooking_view';
function App() {
  return (
    <Router>
      <AppBar position="static" color="transparent">
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
      </Routes>
    </Router>
  );
}

export default App;
