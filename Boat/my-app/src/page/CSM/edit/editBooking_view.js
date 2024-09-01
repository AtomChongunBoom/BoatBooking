import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, Grid, Chip, TextField, Fab, Select, MenuItem, InputLabel, FormControl, Stack
} from '@mui/material';
import { Save as SaveIcon, CheckCircle, Cancel, Schedule, Person, Description } from '@mui/icons-material';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';


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
        resumeHeadline: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    });

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    const timeSlots = ['9:00 - 10:30', '10:00 - 11:30', '11:00 - 12:30', '12:00 - 13:30', '13:00 - 14:30', '13:30 - 15:00'];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCandidate(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDateChange = (event) => setSelectedDate(event.target.value);
    const handleTimeSlotChange = (event) => setSelectedTimeSlot(event.target.value);
    const handleSave = () => console.log('Saving candidate data:', candidate);

    const getStatusColor = (status) => {
        const statusColors = {
            completed: 'success',
            in_progress: 'warning',
            pending: 'info'
        };
        return statusColors[status] || 'error';
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            completed: 'เสร็จสิ้น',
            in_progress: 'กำลังดำเนินการ',
            pending: 'รอดำเนินการ'
        };
        return statusLabels[status] || 'ไม่ทราบสถานะ';
    };

    const getStatusIcon = (status) => {
        const statusIcons = {
            completed: <CheckCircle />,
            in_progress: <Schedule />,
            pending: <Schedule />
        };
        return statusIcons[status] || <Cancel />;
    };

    const renderTicketInfo = () => (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
                    Ticket: {candidate.id}
                </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'end' }}>
                <Card variant="outlined" sx={{ height: '100%', width: '50%' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            สถานะใบงาน
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Chip
                                    sx={{ width: '100%', height: '48px' }}
                                    icon={getStatusIcon("completed")}
                                    label={getStatusLabel("completed")}
                                    color={getStatusColor("completed")}
                                />
                            </Grid>
                            {[
                                { icon: <Person />, label: "ผู้รับผิดชอบ", value: "John Doe" },
                                { icon: <Description />, label: "รายละเอียดเรือ", value: "เรือโกกนุท" },
                                { icon: <Schedule />, label: "รอบ", value: "2024-09-01 รอบ 9:00-10:30" }
                            ].map((item, index) => (
                                <Grid item xs={12} key={index}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        {item.icon}
                                        <Typography variant="body2">{item.label}: {item.value}</Typography>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    const renderBasicInfo = () => (
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
    );

    const renderDateTimeSelection = () => (
        <Card variant="outlined">
            <CardContent sx={{ padding: 0 }}>
                <Box sx={{ height: '30px', width: '100%', bgcolor: '#1976d2', padding: '16px', paddingTop: '20px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Date and Time</Typography>
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
                                    <MenuItem value=""><em>เลือกรอบเวลา</em></MenuItem>
                                    {timeSlots.map((slot, index) => (
                                        <MenuItem key={index} value={slot}>{slot}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ maxWidth: 1900, margin: 'auto', mt: 4, p: 2 }}>
            <Card elevation={3}>
                <CardContent>
                    {renderTicketInfo()}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            {renderBasicInfo()}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {renderDateTimeSelection()}
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
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                <SaveIcon />
            </Fab>
        </Box>
    );
};

export default CandidateProfile;