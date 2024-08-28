import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box,
    TextField,
    Modal,
} from '@mui/material';
import { FaSailboat, FaLocationDot, FaCalendarDays, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6';

const BoatBookingLanding = () => {

    const navigate = useNavigate();

    const boats = [
        { name: 'โกกนุท', image: 'https://trueleasing.co.th/catalog/asset_image/T-700.jpg', price: 'เรือสวยๆ', details: 'รายละเอียดเพิ่มเติมของเรือโกกนุท' },
        { name: 'วาริช', image: 'https://trueleasing.co.th/catalog/asset_image/T-154.jpg', price: 'เรือสวยๆ', details: 'รายละเอียดเพิ่มเติมของเรือวาริช' },
        { name: 'บุษบัน', image: 'https://trueleasing.co.th/catalog/asset_image/_TKP7542_2_.jpg', price: 'เรือสวยๆ', details: 'รายละเอียดเพิ่มเติมของเรือบุษบัน' },
    ];

    const [open, setOpen] = useState(false);
    const [selectedBoat, setSelectedBoat] = useState(null);

    const handleOpen = (boat) => {
        setSelectedBoat(boat);
        setOpen(true);
    };

    const handleNavigate = () => {
        navigate('/booking');
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Box sx={{ flexGrow: 1 }}>

            <Container >
                {/* Hero Section */}
                <Box
                    sx={{
                        bgcolor: 'white',
                        color: 'primary.contrastText',
                        py: 8,
                        mb: 4,
                        borderRadius: 2,
                        mt: 4,
                        padding: 4,

                    }}
                >
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'black' }}>
                                สัมผัสประสบการณ์ล่องเรือสุดพิเศษ
                            </Typography>
                            <Typography variant="h5" paragraph sx={{ color: 'black' }}>
                                เพลิดเพลินไปกับวิวทะเลที่สวยงามและบริการระดับพรีเมียม
                            </Typography>
                            <Button variant="contained" size="large" sx={{ bgcolor: '#1E90FF' }} onChange={handleNavigate}>
                                จองตอนนี้
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: 400,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                }}
                                alt="Luxury yacht"
                                src="https://trueleasing.co.th/static/images/logo-boat.svg"
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Booking Form */}
                {/* <Card sx={{ mb: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              จองทริปของคุณ
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="สถานที่"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <FaLocationDot style={{ marginRight: '8px' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="วันที่"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <FaCalendarDays style={{ marginRight: '8px' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  sx={{ height: '56px' }}
                >
                  ค้นหา
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card> */}

                {/* Featured Boats */}
                <div>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
                        เรือของเรา
                    </Typography>
                    <Grid container spacing={4}>
                        {boats.map((boat, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={boat.image}
                                        alt={boat.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {boat.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {boat.price}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            sx={{ mt: 2 }}
                                            onClick={() => handleOpen(boat)}
                                        >
                                            ดูรายละเอียด
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="boat-details-modal"
                        aria-describedby="boat-details-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            {selectedBoat && (
                                <>
                                    <Typography id="boat-details-modal" variant="h6" component="h2">
                                        {selectedBoat.name}
                                    </Typography>
                                    <Typography id="boat-details-description" sx={{ mt: 2 }}>
                                        {selectedBoat.details}
                                    </Typography>
                                    <Button onClick={handleClose} sx={{ mt: 2 }}>
                                        ปิด
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Modal>
                </div>

                {/* Scenic Views Section */}
                <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
                    วิวทิวทัศน์สุดประทับใจ
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardMedia
                                component="img"
                                sx={{ height: '80%' }}
                                image="https://p16-va.lemon8cdn.com/tos-alisg-v-a3e477-sg/5ca9630891e1425ba564a5d5aebcff1b~tplv-tej9nj120t-origin.webp"
                                alt="Vertical Album Cover"
                            />
                            <CardContent>
                                <Typography variant="subtitle1">
                                    Vertical Album Cover (800x1200 px)
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        sx={{ height: 300 }}
                                        image="https://www.expedia.co.th/stories/wp-content/uploads/2022/05/%E0%B8%AD%E0%B8%A2%E0%B8%B8%E0%B8%98%E0%B8%A2%E0%B8%B2.jpg"
                                        alt="Horizontal Album Cover"
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1">
                                            Horizontal Album Cover (1200x600 px)
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        sx={{ height: 300 }}
                                        image="https://s.isanook.com/tr/0/ud/187/936588/003.jpg"
                                        alt="Square Image 1"
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1">
                                            Square Image (600x600 px)
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        sx={{ height: 300 }}
                                        image="https://www.tripgether.com/wp-content/uploads/tripgetter/FB_haNOAR.jpg"
                                        alt="Square Image 2"
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1">
                                            Square Image (600x600 px)
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Call to Action */}
                <Box sx={{ bgcolor: '#B22222', color: 'secondary.contrastText', p: 4, borderRadius: 2, mt: 6, mb: 4, textAlign: 'center' }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        พร้อมที่จะออกเดินทางแล้วหรือยัง?
                    </Typography>
                    <Button variant="contained" color="primary" size="large" startIcon={<FaSailboat />}>
                        จองเรือเลย
                    </Button>
                </Box>
            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ bgcolor: 'grey.200', p: 6, mt: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="space-evenly">
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                เกี่ยวกับเรา
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                เราให้บริการเช่าเรือคุณภาพสูงพร้อมประสบการณ์การเดินทางที่น่าจดจำ
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                ติดต่อเรา
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                123 ถนนริมทะเล, เมืองท่า 12345
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: info@boatbooking.com
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                โทร: +66 1234 5678
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                ติดตามเรา
                            </Typography>
                            <Button color="primary" startIcon={<FaFacebookF />}>Facebook</Button>
                            <Button color="primary" startIcon={<FaInstagram />}>Instagram</Button>
                            <Button color="primary" startIcon={<FaTwitter />}>Twitter</Button>
                        </Grid>
                    </Grid>
                    <Box mt={5}>
                        <Typography variant="body2" color="text.secondary" align="center">
                            {'Copyright © '}
                            เช่าเรือสำราญ {new Date().getFullYear()}
                            {'.'}
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default BoatBookingLanding;