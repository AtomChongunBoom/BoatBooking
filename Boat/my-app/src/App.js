import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import BookingView from './page/booking_view';
import CSMTable from './page/manage_view';
import LandingPage from './page/landingPage';

function App() {
  return (
    <Router>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            เช่าเรือสำราญ
          </Typography>
          <Button color="inherit" component={Link} to="/" >หน้าหลัก</Button>
          <Button color="inherit" component={Link} to="/admin">Admin</Button>
          <Button color="inherit" component={Link} to="/booking">ติดต่อเรา</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<CSMTable />} />
        <Route path="/booking" element={<BookingView />} />
      </Routes>
    </Router>
  );
}

export default App;
