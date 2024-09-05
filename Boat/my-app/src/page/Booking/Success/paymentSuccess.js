import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          การชำระเงินเสร็จสมบูรณ์
        </Typography>
        <Typography variant="body1" paragraph>
          ขอบคุณสำหรับการสั่งซื้อ เราได้รับการชำระเงินของคุณเรียบร้อยแล้ว
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="outlined"  color="primary" onClick={()=>navigate('/')}>
            กลับสู่หน้าหลัก
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccessPage;