import React from 'react';
import { Stepper, Step, StepLabel, Typography, Box } from '@mui/material';
import { IoTime } from "react-icons/io5";
import { FaShip } from "react-icons/fa";
import { MdPeople } from "react-icons/md";

const steps = [
  { label: 'ระบุวันเดินทาง', icon: <IoTime /> },
  { label: 'เลือกเดินทาง', icon: <FaShip /> },
  { label: 'ระบุจำนวนผู้โดยสาร', icon: <MdPeople /> },
];

function CustomStepper({ currentStep }) {
  return (
    <Box sx={{ width: '96%', bgcolor: '#ffffff', margin: 4, height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stepper alternativeLabel sx={{ width: '100%' }}>
        {steps.map((step, index) => (
          <Step key={step.label} active={index <= currentStep}>
            <StepLabel
              icon={
                <Box
                  sx={{
                    bgcolor: index <= currentStep ? '#e6f2ff' : '#f0f0f0',
                    borderRadius: '50%',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: index === currentStep ? '0 4px 10px rgba(0, 0, 0, 0.12)' : 'none',
                  }}
                >
                  {React.cloneElement(step.icon, { style: { color: index <= currentStep ? '#1976d2' : '#b0b0b0', fontSize: '36px' } })}
                </Box>
              }
            >
              <Typography variant="caption" fontWeight="bold" color={index <= currentStep ? '#333' : '#b0b0b0'} fontSize={20}>
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default CustomStepper;
