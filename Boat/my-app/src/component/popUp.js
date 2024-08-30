import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const BoatDetailsModal = ({ open, handleClose, selectedBoat, imageUrl }) => {
    if (!selectedBoat) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ pr: 6, margin: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold" >
                    {selectedBoat.name}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} >
                    <Grid item xs={12} md={4} x={{display:'flex',justifyContent:'center',alignItems:'center',border:'1px solid black',borderRadius:4}}>
                        <Box sx={{ mt: 2 }}>
                            <DetailItem label="รุ่น" value={selectedBoat.model} />
                            <DetailItem label="เครื่องยนต์" value={selectedBoat.engine} />
                            <DetailItem label="สีไม้ของเรือ" value={selectedBoat.woodColor} />
                            <DetailItem label="สีภายใน" value={selectedBoat.interiorColor} />
                            <DetailItem label="สีท้องเรือ" value={selectedBoat.hullColor} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <Box
                            component="img"
                            sx={{
                                width: '136%',
                                height: '300px',
                                objectFit: 'cover',
                                borderRadius: 1,
                            }}
                            src={selectedBoat.image}
                            alt={selectedBoat.name}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

const DetailItem = ({ label, value }) => (
    <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant="body1" color="text.secondary" sx={{marginRight:2}}>{label}:</Typography>
        <Typography variant="body1">{value}</Typography>
    </Box>
);