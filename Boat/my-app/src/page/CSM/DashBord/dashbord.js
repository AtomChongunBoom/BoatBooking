import React from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, Avatar } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 180 },
  { month: 'Feb', sales: 160 },
  { month: 'Mar', sales: 60 },
  { month: 'Apr', sales: 100 },
  { month: 'May', sales: 40 },
  { month: 'Jun', sales: 140 },
  { month: 'Jul', sales: 150 },
  { month: 'Aug', sales: 170 },
  { month: 'Sep', sales: 180 },
  { month: 'Oct', sales: 200 },
  { month: 'Nov', sales: 180 },
  { month: 'Dec', sales: 130 },
];

const trafficData = [
  { name: 'Desktop', value: 63 },
  { name: 'Tablet', value: 15 },
  { name: 'Phone', value: 22 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const latestProducts = [
  { name: 'Soap & Co. Eucalyptus', image: '/api/placeholder/50/50' },
  { name: 'Necessaire Body Lotion', image: '/api/placeholder/50/50' },
  { name: 'Ritual of Sakura', image: '/api/placeholder/50/50' },
  { name: 'Lancome Rouge', image: '/api/placeholder/50/50' },
  { name: 'Etiology Aloe Vera', image: '/api/placeholder/50/50' },
];

const latestOrders = [
  { id: 'ORD-207', customer: 'Marianna Tarkova', date: 'Mar 8, 2024', status: 'Pending' },
  { id: 'ORD-206', customer: 'Can Yu', date: 'Mar 8, 2024', status: 'Delivered' },
  { id: 'ORD-204', customer: 'Alissa Richardson', date: 'Mar 8, 2024', status: 'Refunded' },
  { id: 'ORD-203', customer: 'Anje Keizer', date: 'Mar 8, 2024', status: 'Pending' },
  { id: 'ORD-202', customer: 'Clarke Gillebert', date: 'Mar 8, 2024', status: 'Delivered' },
];

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">Budget</Typography>
              <Typography variant="h4">$24k</Typography>
              <Typography variant="body2" color="text.secondary">12% Since last month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">Total Customers</Typography>
              <Typography variant="h4">1.6k</Typography>
              <Typography variant="body2" color="text.secondary">16% Since last month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">Task Progress</Typography>
              <Typography variant="h4">75.5%</Typography>
              <LinearProgress variant="determinate" value={75.5} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">Total Profit</Typography>
              <Typography variant="h4">$15k</Typography>
              <Typography variant="body2" color="text.secondary">+25% Since last month</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>Sales</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Traffic Source */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>Traffic Source</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                {trafficData.map((entry, index) => (
                  <Typography key={entry.name} variant="body2">
                    {entry.name}: {entry.value}%
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Latest Products */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>Latest Products</Typography>
              <Table>
                <TableBody>
                  {latestProducts.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell>
                        <Avatar src={product.image} alt={product.name} />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Latest Orders */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>Latest Orders</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latestOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;