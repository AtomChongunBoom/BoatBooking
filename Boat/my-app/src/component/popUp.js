import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Grid,
    useMediaQuery,
    useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const BoatDetailsModal = ({ open, handleClose, selectedBoat }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!selectedBoat) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
        >
            <DialogTitle sx={{ pr: 6, margin: 1 }}>
                <Typography variant="h5" component="div" fontWeight="bold">
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
                <Grid container spacing={2} direction={isMobile ? 'column-reverse' : 'row'}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ 
                            height:'80%',
                            mt: 2, 
                            p: 2, 
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 2
                        }}>
                            <DetailItem label="รุ่น" value={selectedBoat.model} />
                            <DetailItem label="เครื่องยนต์" value={selectedBoat.engine} />
                            <DetailItem label="สีไม้ของเรือ" value={selectedBoat.woodColor} />
                            <DetailItem label="สีภายใน" value={selectedBoat.interiorColor} />
                            <DetailItem label="สีท้องเรือ" value={selectedBoat.hullColor} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            sx={{
                                width: '100%',
                                height: isMobile ? '200px' : '300px',
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
    <Box sx={{ display: 'flex', mb: 1, flexWrap: 'wrap' }}>
        <Typography variant="body1" color="text.secondary" sx={{marginRight: 2, minWidth: '100px'}}>{label}:</Typography>
        <Typography variant="body1">{value}</Typography>
    </Box>
);

export default BoatDetailsModal;