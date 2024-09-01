import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box,
    Modal,
    TextField,
    aLocationDot,
} from '@mui/material';
import { FaSailboat, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6';
import { BoatDetailsModal } from '../../component/popUp';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const BoatBookingLanding = () => {


    const boats = [
        {
            name: 'โกกนุท',
            image: 'https://trueleasing.co.th/catalog/asset_image/T-700.jpg',
            price: 'เรือสวยๆ', details: 'รายละเอียดเพิ่มเติมของเรือโกกนุท',
            model: '32’ Twin Engine Sport',
            engine: '6.0L Crusader (X2)',
            woodColor: 'Custom Brown',
            interiorColor: 'Custom Ivory',
            hullColor: 'White Waterline'
        },
        {
            name: 'วาริช',
            image: 'https://trueleasing.co.th/catalog/asset_image/T-154.jpg',
            price: 'เรือสวยๆ',
            details: 'รายละเอียดเพิ่มเติมของเรือวาริช',
            model: '30’ Triple Cockpit Runabout',
            engine: 'Crusader 8.1L HO',
            woodColor: 'Traditional Hacker',
            interiorColor: 'Burgundy',
            hullColor: 'Burgundy'
        },
        {
            name: 'บุษบัน',
            image: 'https://trueleasing.co.th/catalog/asset_image/_TKP7542_2_.jpg',
            price: 'เรือสวยๆ',
            details: 'รายละเอียดเพิ่มเติมของเรือบุษบัน',
            model: '30’ Triple Cockpit Runabout',
            engine: 'Crusader 8.1L HO',
            woodColor: 'Traditional Hacker',
            interiorColor: 'Burgundy',
            hullColor: 'Burgundy'
        },
    ];

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedBoat, setSelectedBoat] = useState(null);
    const handleOpen = (index) => {
        setSelectedBoat(boats[index]);
        setOpen(true);
    };

    const handleNavigate = () => {
        navigate('/booking');
    };

    const handleClose = () => {
        setOpen(false);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // จะเลื่อนอย่างนุ่มนวล
        });
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
                            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '	#191970' }}>
                                เปิดประสบการณ์ที่ท่องเที่ยว
                                แลนด์มาร์คแห่งใหม่ ริมน้ำอยุธยา
                            </Typography>
                            <Typography variant="h9" paragraph sx={{ color: 'black' }}>
                                สัมผัสการท่องเที่ยวแบบเช้าเย็นกลับ เดินทาง-กิน-ดื่ม-เที่ยว ครบในที่เดียว
                                สวยงามและพิเศษแตกต่างจากประสบการณ์เที่ยวอยุธยาที่ผ่านมา
                                ที่มาพร้อมบริการที่หลากหลายจาก ทรู ลีสซิ่ง
                            </Typography>
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
                                src="https://d1aeyn46ohn8t4.cloudfront.net/eyJidWNrZXQiOiJjbXMucHJvZC50cnVlLWxlYXNpbmciLCJrZXkiOiJ0cnVlLWxlYXNpbmcvdjEvbWVkaWEvMTcxOTg4NTA1NjAyMCIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MjAwMCwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfX19"
                            />
                        </Grid>
                    </Grid>
                </Box>
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
                            <Box
                                component="img"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: 400,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                }}
                                alt="Luxury yacht"
                                src="https://s3-ap-southeast-1.amazonaws.com/cms.prod.true-leasing/true-leasing/v1/media/1673323607995"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '	#191970' }}>
                                เรือทรู ลีสซิ่ง
                            </Typography>
                            <Typography variant="h9" paragraph sx={{ color: 'black' }}>
                                ล่องเรือสุดเอ็กซ์คลูซีฟ เริ่มต้นด้วยการชมคอลเลคชั่นเรือคลาสสิกที่ทรู ลีสซิ่ง อยุธยา ก่อนลงเรือจากท่าเรือที่ตกแต่งสไตล์ท่าเรือจากทะเลสาบอิตาลีแห่งเดียวในไทย ล่องชมวัดเก่าแก่ เจดีย์ โบราณสถาน ที่เต็มไปด้วยเรื่องราวทางประวัติศาสตร์ ถ่ายรูปกับวัดไชยวัฒนาราม ที่สวยโดดเด่นตระหง่านริมน้ำ และวัดพุทไธศวรรย์ โดดเด่นด้วยปรางค์ประธานองค์ใหญ่ศิลปะแบบขอมที่ยังสมบูรณ์อยู่เป็นเอกลักษณ์คู่วัด เพลิดเพลินกับการให้อาหารปลา เหมาะสำหรับล่องเรือส่วนตัว รองรับลูกค้าองค์กร และงานอีเว้นท์ต่างๆ
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>




                {/* Booking Form */}
                <Card sx={{ mb: 4, p: 2 }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom>
                            จองทริปของคุณ
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="วันที่"
                                    variant="outlined"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: <FaCalendarAlt style={{ marginRight: '8px' }} />,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="รอบ"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <FaMapMarkerAlt style={{ marginRight: '8px' }} />,
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
                </Card>
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
                                            onClick={() => handleOpen(index)}
                                        >
                                            ดูรายละเอียด
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <BoatDetailsModal open={open} handleClose={handleClose} selectedBoat={selectedBoat} />
                    {/* <Modal
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
                    </Modal> */}
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
                    <Button variant="contained" color="primary" size="large" startIcon={<FaSailboat />} onClick={scrollToTop}>
                        จองเรือเลย
                    </Button>
                </Box>
            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ bgcolor: 'grey.200', p: 6, mt: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="space-evenly">
                        <Grid item xs={12} sm={4}>
                            <Box>
                                <img src="https://ik.imagekit.io/tvlk/image/imageResource/2023/06/29/1688022859636-852e89a793fd448275fdc71c91824f06.png?tr=q-75" alt="Trueleasing Logo" style={{ height: '50px' }} />
                            </Box>
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
                                616 ถ. หลวงแพ่ง แขวงทับยาว เขตลาดกระบัง กรุงเทพมหานคร 10520
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: trueleasing@boatbooking.com
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                โทร:  02 859 7878
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
                            trueleasing {new Date().getFullYear()}
                            {'.'}
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default BoatBookingLanding;