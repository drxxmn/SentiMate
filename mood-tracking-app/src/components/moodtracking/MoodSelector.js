import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const emojis = [
    { icon: <SentimentVeryDissatisfiedIcon fontSize="large" />, label: 'Very Dissatisfied' },
    { icon: <SentimentDissatisfiedIcon fontSize="large" />, label: 'Dissatisfied' },
    { icon: <SentimentSatisfiedIcon fontSize="large" />, label: 'Neutral' },
    { icon: <SentimentSatisfiedAltIcon fontSize="large" />, label: 'Satisfied' },
    { icon: <SentimentVerySatisfiedIcon fontSize="large" />, label: 'Very Satisfied' }
];

const MoodSelector = ({ onSelect }) => {
    const [selected, setSelected] = useState(null);

    const handleClick = (index) => {
        setSelected(index);
        onSelect(index);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
            {emojis.map((emoji, index) => (
                <IconButton
                    key={index}
                    color={selected === index ? "primary" : "default"}
                    onClick={() => handleClick(index)}
                >
                    {emoji.icon}
                </IconButton>
            ))}
        </Box>
    );
};

export default MoodSelector;
