import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Box, IconButton, Tooltip, Typography, TextField, Grid, Card } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
    { field: 'id', headerName: 'ID', width: 90,flex:1 },
    { field: 'date', headerName: 'Date', width: 150 ,flex:1},
    { field: 'time', headerName: 'Time', width: 120 ,flex:1},
    { field: 'adults', headerName: 'Adults', width: 100,flex:1 },
    { field: 'children', headerName: 'Children', width: 100 ,flex:1},
    { field: 'total_people', headerName: 'Total People', width: 150 ,flex:1},
    {
        field: 'total_price', headerName: 'Total Price', width: 150,justifyContent:'center',alignItems:'center',
        renderCell: (params) => (
            <Typography variant="body2" color="primary">
                ${params.value.toFixed(2)}
            </Typography>
        )
    },
    { field: 'customer_name', headerName: 'Customer Name', width: 200,flex:1 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Edit">
                    <IconButton color="primary">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
    },
];

const CSMTable = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getticketboat');
                setRows(response.data);
                setFilteredRows(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (filterText) {
            setFilteredRows(rows.filter(row =>
                row.customer_name.toLowerCase().includes(filterText.toLowerCase()) ||
                row.email.toLowerCase().includes(filterText.toLowerCase())
            ));
        } else {
            setFilteredRows(rows);
        }
    }, [filterText, rows]);

    const totalPeople = filteredRows.reduce((sum, row) => sum + row.total_people, 0);
    const totalPrice = filteredRows.reduce((sum, row) => sum + row.total_price, 0);

    return (
        <Box>
            <Card sx={{ width: '90%', margin: 4  ,p:2}}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Search"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="h6">Total People: {totalPeople}</Typography>
                        <Typography variant="h6" sx={{ ml: 2 }}>Total Price: ${totalPrice.toFixed(2)}</Typography>
                    </Grid>
                </Grid>
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        loading={loading}
                        sx={{
                            '& .MuiDataGrid-columnHeader': {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                                borderBottom: '2px solid #ddd',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #ddd',
                            },
                            '& .MuiDataGrid-row': {
                                '&:nth-of-type(even)': {
                                    backgroundColor: '#fafafa',
                                },
                            },
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                        }}
                    />
                </Box>
            </Card>
        </Box>
    );
};

export default CSMTable;
