import React from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Grid, 
  Typography, 
  Container, 
  Paper
} from '@mui/material';

const Resgiter_view = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          ระบุข้อมูลส่วนบุคคล
        </Typography>
        
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ bgcolor: 'warning.light', p: 2, mb: 2 }}>
            บันทึกข้อความ: กรุณากรอกข้อมูลตามความเป็นจริง เพื่อประโยชน์แก่ตัวท่านเอง
          </Typography>
          
          <TextField
            fullWidth
            label="เลขบัตรประชาชน"
            required
            margin="normal"
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="คำนำหน้า"
                required
                margin="normal"
              >
                <MenuItem value="นาย">นาย</MenuItem>
                <MenuItem value="นาง">นาง</MenuItem>
                <MenuItem value="นางสาว">นางสาว</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="ชื่อ"
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="นามสกุล"
                required
                margin="normal"
              />
            </Grid>
          </Grid>
          
          <TextField
            select
            fullWidth
            label="เพศ"
            required
            margin="normal"
          >
            <MenuItem value="ชาย">ชาย</MenuItem>
            <MenuItem value="หญิง">หญิง</MenuItem>
          </TextField>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="วัน"
                required
                margin="normal"
              >
                {[...Array(31)].map((_, i) => (
                  <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="เดือน"
                required
                margin="normal"
              >
                {['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'].map((month, index) => (
                  <MenuItem key={index} value={month}>{month}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="ปีเกิด"
                required
                margin="normal"
              >
                {[...Array(100)].map((_, i) => (
                  <MenuItem key={i} value={2024 - i}>{2024 - i}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="สัญชาติ"
                required
                margin="normal"
              >
                <MenuItem value="ไทย">ไทย</MenuItem>
                <MenuItem value="อื่นๆ">อื่นๆ</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="ประเทศที่เกิด"
                required
                margin="normal"
              >
                <MenuItem value="ไทย">ไทย</MenuItem>
                <MenuItem value="อื่นๆ">อื่นๆ</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="จังหวัดที่เกิด"
                required
                margin="normal"
              >
                <MenuItem value="กรุงเทพมหานคร">กรุงเทพมหานคร</MenuItem>
                <MenuItem value="อื่นๆ">อื่นๆ</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          
          <TextField
            fullWidth
            label="อาชีพ"
            required
            margin="normal"
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="ศาสนา"
                required
                margin="normal"
              >
                <MenuItem value="พุทธ">พุทธ</MenuItem>
                <MenuItem value="คริสต์">คริสต์</MenuItem>
                <MenuItem value="อิสลาม">อิสลาม</MenuItem>
                <MenuItem value="อื่นๆ">อื่นๆ</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="ระดับการศึกษาสูงสุด"
                required
                margin="normal"
              >
                <MenuItem value="ประถมศึกษา">ประถมศึกษา</MenuItem>
                <MenuItem value="มัธยมศึกษา">มัธยมศึกษา</MenuItem>
                <MenuItem value="ปริญญาตรี">ปริญญาตรี</MenuItem>
                <MenuItem value="สูงกว่าปริญญาตรี">สูงกว่าปริญญาตรี</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="สถานะภาพสมรส"
                required
                margin="normal"
              >
                <MenuItem value="โสด">โสด</MenuItem>
                <MenuItem value="สมรส">สมรส</MenuItem>
                <MenuItem value="หย่าร้าง">หย่าร้าง</MenuItem>
                <MenuItem value="หม้าย">หม้าย</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="หมู่เลือด"
                required
                margin="normal"
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="AB">AB</MenuItem>
                <MenuItem value="O">O</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          
          <TextField
            select
            fullWidth
            label="ประวัติการแพ้ (ยา/อาหาร/อื่นๆ)"
            required
            margin="normal"
          >
            <MenuItem value="ไม่มี">ไม่มี</MenuItem>
            <MenuItem value="มี">มี</MenuItem>
          </TextField>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ชื่อ-นามสกุล บิดา"
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ชื่อ-นามสกุล มารดา"
                required
                margin="normal"
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Resgiter_view;