import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, Grid, Chip, TextField, Fab, Select, MenuItem, InputLabel, FormControl, Stack
} from '@mui/material';
import { Email, Phone, Save as SaveIcon } from '@mui/icons-material';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { IoMdPerson } from "react-icons/io";

import { CheckCircle, Cancel, Schedule, Person, Description } from '@mui/icons-material';

const CandidateProfile = () => {
    const [candidate, setCandidate] = useState({
        id: 'WDR1212312121',
        first_name: 'Poochit',
        last_name: 'Sakunthong',
        email: 'atom.14110@gmail.com',
        phone: '0912345678',
        status: 'รอชำระเงิน',
        adult: 8,
        child: 2,
        total: 10,
        address: "กรุงเทพ",
        date: '28-10-2015',
        time: '00:00:00',
        skills: {
            keySkill: ['Critical Reasoning'],
            professionalSkill: ['Java', 'C/ C++', 'ReactJS', 'Marketing']
        },
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        resumeHeadline: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    });

    const timeSlots = ['9:00 - 10:30', '10:00 - 11:30', '11:00 - 12:30', '12:00 - 13:30', '13:00 - 14:30', '13:30 - 15:00'];


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCandidate(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Implement save logic here
        console.log('Saving candidate data:', candidate);
        // You might want to send this data to an API or perform other actions
    };

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleTimeSlotChange = (event) => {
        setSelectedTimeSlot(event.target.value);
    };

    const getStatusColor = (status) => {
        switch (status) {
          case 'completed': return 'success';
          case 'in_progress': return 'warning';
          case 'pending': return 'info';
          default: return 'error';
        }
      };
    
      const getStatusLabel = (status) => {
        switch (status) {
          case 'completed': return 'เสร็จสิ้น';
          case 'in_progress': return 'กำลังดำเนินการ';
          case 'pending': return 'รอดำเนินการ';
          default: return 'ไม่ทราบสถานะ';
        }
      };
    
      const getStatusIcon = (status) => {
        switch (status) {
          case 'completed': return <CheckCircle />;
          case 'in_progress': return <Schedule />;
          case 'pending': return <Schedule />;
          default: return <Cancel />;
        }
      };

    return (
        <Box sx={{ maxWidth: 1900, margin: 'auto', mt: 4, p: 2 }}>
            <Card elevation={3}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                                Ticket: {candidate.id}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IoMdPerson style={{ marginRight: '8px', fontSize: '24px' }} />
                                    {candidate.first_name} {candidate.last_name}
                                </Typography>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Email style={{ marginRight: '8px', fontSize: '24px' }} />
                                    {candidate.email}
                                </Typography>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <Phone style={{ marginRight: '8px', fontSize: '24px' }} />
                                    {candidate.phone}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent sx={{ padding: 0 }}>
                                    <Box sx={{ height: '30px', width: '100%', bgcolor: '#1976d2', padding: '16px', paddingTop: '20px' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Basic info</Typography>
                                    </Box>
                                    <Grid container spacing={2} sx={{ padding: '16px' }}>
                                        {[
                                            { label: "ชื่อ", name: "first_name" },
                                            { label: "นามสกุล", name: "last_name" },
                                            { label: "Email", name: "email" },
                                            { label: "เบอร์โทรศัพท์", name: "phone" },
                                            { label: 'จำนวนผู้โดยสาร "ผู้ใหญ่"', name: "adult" },
                                            { label: 'จำนวนผู้โดยสาร "เด็ก"', name: "child" },
                                            { label: 'จำนวนผู้โดยสาร ทั้งหมด', name: "total" },
                                            { label: 'ที่อยู่', name: "address" }
                                        ].map((field) => (
                                            <Grid item xs={12} key={field.name}>
                                                <TextField
                                                    fullWidth
                                                    label={field.label}
                                                    name={field.name}
                                                    value={candidate[field.name]}
                                                    onChange={handleInputChange}
                                                    variant="outlined"
                                                    size="medium"
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {/* <Card variant="outlined">
                                <CardContent sx={{ padding: 0 }}>
                                    <Box sx={{ height: '30px', width: '100%', bgcolor: '#1976d2', padding: '12px', paddingTop: '20px' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Skill</Typography>
                                    </Box>
                                    <Box padding={4}>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Key Skill</Typography>
                                        <Box sx={{ mb: 2 }}>
                                            {candidate.skills.keySkill.map(skill => (
                                                <Chip key={skill} label={skill} sx={{ m: 0.5, bgcolor: 'primary.light', color: 'primary.contrastText' }} />
                                            ))}
                                        </Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Professional Skill</Typography>
                                        <Box>
                                            {candidate.skills.professionalSkill.map(skill => (
                                                <Chip key={skill} label={skill} variant="outlined" sx={{ m: 0.5 }} />
                                            ))}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card> */}

                            <Card variant="outlined">
                                <CardContent sx={{ padding: 0 }}>
                                    <Box sx={{ height: '30px', width: '100%', bgcolor: '#1976d2', padding: '16px', paddingTop: '20px' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Skill</Typography>
                                    </Box>
                                    <Box margin={4}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="วันที่"
                                                    variant="outlined"
                                                    type="date"
                                                    value={selectedDate}
                                                    onChange={handleDateChange}
                                                    InputLabelProps={{ shrink: true }}
                                                    InputProps={{
                                                        startAdornment: <FaCalendarAlt style={{ marginRight: '8px' }} />,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel id="time-slot-label">รอบเวลา</InputLabel>
                                                    <Select
                                                        labelId="time-slot-label"
                                                        id="time-slot-select"
                                                        value={selectedTimeSlot}
                                                        onChange={handleTimeSlotChange}
                                                        label="รอบเวลา"
                                                        startAdornment={<FaClock style={{ marginRight: '8px' }} />}
                                                    >
                                                        <MenuItem value="">
                                                            <em>เลือกรอบเวลา</em>
                                                        </MenuItem>
                                                        {timeSlots.map((slot, index) => (
                                                            <MenuItem key={index} value={slot}>
                                                                {slot}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card variant="outlined" sx={{ mt: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        สถานะใบงาน
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Chip
                                             size="lage"
                                                icon={getStatusIcon("in_progress")}
                                                label={getStatusLabel("in_progress")}
                                                color={getStatusColor("in_progress")}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Person />
                                                <Typography variant="body2">ผู้รับผิดชอบ: {"John Doe"}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Description />
                                                <Typography variant="body2">รายละเอียด: {"ตรวจสอบระบบไฟฟ้า"}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Schedule />
                                                <Typography variant="body2">กำหนดส่ง: 2024-09-01</Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Card variant="outlined" sx={{ mt: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'large', mb: 1 }}>Resume Headline</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name="resumeHeadline"
                                value={candidate.resumeHeadline}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
            <Fab
                color="primary"
                aria-label="save"
                onClick={handleSave}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}
            >
                <SaveIcon />
            </Fab>

        </Box>
    );
};

export default CandidateProfile;