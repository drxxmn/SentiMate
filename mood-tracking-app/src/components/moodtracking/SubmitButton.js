import React from 'react';
import { Button } from '@mui/material';

const SubmitButton = ({ onSubmit }) => {
    return (
        <Button variant="contained" color="primary" onClick={onSubmit} style={{ marginTop: '20px' }}>
            Submit Mood
        </Button>
    );
};

export default SubmitButton;
