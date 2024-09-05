import React, { useEffect, useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { AppBar, Toolbar,Box, Grid, Card, CardContent, Typography, CircularProgress, TextField, IconButton, Chip,Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookingsIcon from '@mui/icons-material/EventNote';
import RevenueIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import BoatIcon from '@mui/icons-material/DirectionsBoat';
import Cookies from 'js-cookie';
import { authenticateUser } from '../../service/user_service';

const CSMTable = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [userData, setUserData] = useState();

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getticketboat');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo()
        fetchData();
    }, []);

    const totalBookings = data.length;
    const totalRevenue = data.reduce((sum, booking) => sum + booking.total_price, 0);
    const totalPeople = data.reduce((sum, booking) => sum + booking.total_people, 0);
    const BoatInStock = 10;

    const bookingsByDate = data.reduce((acc, booking) => {
        acc[booking.date] = (acc[booking.date] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(bookingsByDate).map(([date, count]) => ({
        date,
        bookings: count,
    }));

    const handleEdit = (id) => {
        console.log(`Edit booking with id: ${id}`);
        // Implement edit logic here
    };

    const handleDelete = (id) => {
        console.log(`Delete booking with id: ${id}`);
        // Implement delete logic here
    };

    const fetchUserInfo = async () => {
        const token = Cookies.get('token')
        console.log("token", token);
        const response = await authenticateUser(token);
        console.log("UserData", response);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'เสร็จสิ้น':
                return { color: 'success', backgroundColor: '#e6f4ea', borderColor: '#34a853' };
            case 'รอชำระเงิน':
                return { color: 'warning', backgroundColor: '#fff8e1', borderColor: '#ffa000' };
            case 'ยกเลิกการจอง':
                return { color: 'error', backgroundColor: '#fde7e7', borderColor: '#d32f2f' };
            case 'พร้อมให้บริการ':
                return { color: 'info', backgroundColor: '#e3f2fd', borderColor: '#1976d2' };
            default:
                return { color: 'default', backgroundColor: '#f5f5f5', borderColor: '#9e9e9e' };
        }
    };

    const columns = [
        { field: 'booking_id', headerName: 'เลขที่ใบงาน', width: 70, flex: 1.5 },
        { field: 'date', headerName: 'วันที่', width: 130, flex: 1 },
        { field: 'time', headerName: 'รอบ', width: 130, flex: 1 },
        { field: 'first_name', headerName: 'ชื่อจริง', width: 200, flex: 1 },
        { field: 'last_name', headerName: 'นามสกุล', width: 200, flex: 1 },
        { field: 'total_people', headerName: 'จำนวนผู้โดยสาร', width: 100, flex: 1 },
        { field: 'email', headerName: 'Email', width: 200, flex: 1.5 },
        { field: 'tel', headerName: 'เบอร์โทร', width: 200, flex: 1 },
        {
            field: 'amount',
            headerName: 'ราคาจอง',
            width: 130,
            renderCell: (params) => `${params.value.toFixed(2)} ฿`,
        },
        {
            field: 'vat',
            headerName: 'ภาษีมูลค่าเพิ่ม',
            width: 130,
            renderCell: (params) => `${params.value.toFixed(2)} ฿`,
        },
        {
            field: 'total_price',
            headerName: 'จำนวนเงินสุธิ',
            width: 130,
            renderCell: (params) => `${params.value.toFixed(2)} ฿`,
        },
        {
            field: 'status',
            headerName: 'สภาณะ',
            width: 200,
            flex: 1,
            renderCell: (params) => {
                const { color, backgroundColor, borderColor } = getStatusColor(params.value);
                return (
                    <Chip
                        label={params.value}
                        color={color}
                        variant="outlined"
                        sx={{
                            width: '120px',
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
                            '& .MuiChip-label': {
                                color: borderColor,
                            },
                        }}
                    />
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => navigate('/admin/edit')} className="text-blue-600 hover:text-blue-800">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)} className="text-red-600 hover:text-red-800">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const filteredData = data.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-screen">
                <CircularProgress className="text-blue-600" />
            </Box>
        );
    }

    return (
        <Box>
            <AppBar position="static" color="transparent" sx={{ boxShadow: 2 }} >
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
            </AppBar>
            <Box className="p-6 bg-blue-50 min-h-screen" sx={{ padding: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Card className="bg-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <BookingsIcon fontSize="large" />
                                    <Typography variant="h6" className="font-semibold ml-2"> Total Bookings</Typography>
                                </Box>
                                <Typography variant="h4" className="mt-2">{totalBookings}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Card className="bg-blue-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <RevenueIcon fontSize="large" />
                                    <Typography variant="h6" className="font-semibold ml-2"> Total Revenue</Typography>
                                </Box>
                                <Typography variant="h4" className="mt-2">{totalRevenue.toFixed(2)}฿</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Card className="bg-blue-400 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <PeopleIcon fontSize="large" />
                                    <Typography variant="h6" className="font-semibold ml-2"> Total People</Typography>
                                </Box>
                                <Typography variant="h4" className="mt-2">{totalPeople}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Card className="bg-blue-300 text-blue-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <BoatIcon fontSize="large" />
                                    <Typography variant="h6" className="font-semibold ml-2"> Boats In Stock</Typography>
                                </Box>
                                <Typography variant="h4" className="mt-2">{BoatInStock}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card className="shadow-lg">
                            <CardContent>
                                <Typography variant="h6" className="mb-4 text-blue-800 font-semibold">Bookings by Date</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="bookings" fill="#3182ce" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Box className="mt-8" sx={{ padding: 2 }}>
                    <Card className="shadow-lg">
                        <CardContent>
                            <Grid container spacing={2} className="mb-4">
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Search"
                                        value={filterText}
                                        onChange={(e) => setFilterText(e.target.value)}
                                        className="bg-white"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} className="flex items-center justify-end">
                                    <Typography variant="h6" className="text-blue-800 mr-4">Total People: {totalPeople}</Typography>
                                    <Typography variant="h6" className="text-blue-800">Total Revenue: ${totalRevenue.toFixed(2)}</Typography>
                                </Grid>
                            </Grid>
                            <Box className="h-[250px] w-full">
                                <DataGrid
                                    rows={filteredData}
                                    columns={columns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10, 25, 50]}
                                    checkboxSelection
                                    disableSelectionOnClick
                                    loading={loading}
                                    className="bg-white"
                                    sx={{
                                        '& .MuiDataGrid-columnHeader': {
                                            backgroundColor: '#ebf8ff',
                                            color: '#2c5282',
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            borderBottom: '1px solid #e2e8f0',
                                        },
                                        '& .MuiDataGrid-row': {
                                            '&:nth-of-type(even)': {
                                                backgroundColor: '#f7fafc',
                                            },
                                            '&:hover': {
                                                backgroundColor: '#ebf8ff',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default CSMTable;