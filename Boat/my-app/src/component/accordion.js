import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  TextField,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>โปรดเลือกขั้นตอนการชำระเงินดังล่าง</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="voucher" control={<Radio />} label="วอดเลด" />
          <FormControlLabel value="creditCard" control={<Radio />} label="บัตรเครดิต/เดบิต" />
          
          {paymentMethod === 'creditCard' && (
            <Box sx={{ ml: 4, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCardIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  รับบัตรเครดิต ทั้ง Visa และ Master Card ลูกค้าสามารถมั่นใจได้ในความปลอดภัยของข้อมูลได้
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="หมายเลขบัตร"
                variant="outlined"
                placeholder="1234 1234 1234 1234"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="ชื่อเจ้าของบัตร"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="วันหมดอายุ"
                  variant="outlined"
                  placeholder="MM/YY"
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="รหัสลับบัตร"
                  variant="outlined"
                  placeholder="123"
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          )}
          
          <FormControlLabel value="paypal" control={<Radio />} label="พัฒนาการชำระเงินด้วยเครดิต" />
          <FormControlLabel value="voucher" control={<Radio />} label="Voucher Classic Travel Club" />
        </RadioGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export default PaymentForm;