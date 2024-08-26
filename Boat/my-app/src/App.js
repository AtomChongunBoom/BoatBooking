import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import BookingView from './page/booking_view';
import CSMTable from './page/manage_view';

function App() {
  return (
    <Router>
      <AppBar position="static" sx={{ backgroundColor: '#333' }}>
        <Container>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
              My App
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={{ color: '#fff' }}>Home</Button>
            <Button color="inherit" component={Link} to="/about" sx={{ color: '#fff' }}>About</Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Routes>
        <Route path="/" element={<BookingView />} />
        <Route path="/about" element={<CSMTable />} />
      </Routes>
    </Router>
  );
}

export default App;
