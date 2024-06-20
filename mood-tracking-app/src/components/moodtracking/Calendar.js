import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const localizer = momentLocalizer(moment);

const moodIcons = [
    <SentimentVeryDissatisfiedIcon />,
    <SentimentDissatisfiedIcon />,
    <SentimentSatisfiedIcon />,
    <SentimentSatisfiedAltIcon />,
    <SentimentVerySatisfiedIcon />
];

const moodColors = [
    '#ff0000',
    '#ff7f00',
    '#ffff00',
    '#7fff00',
    '#00ff00'
];

const Calendar = ({ moodData }) => {
    const events = moodData.map(entry => ({
        title: moodIcons[entry.mood],
        start: new Date(entry.timestamp),
        end: new Date(entry.timestamp),
        allDay: true,
        color: moodColors[entry.mood]
    }));

    const EventComponent = ({ event }) => (
        <Box display="flex" justifyContent="center" alignItems="center" bgcolor={event.color} height="100%">
            {event.title}
        </Box>
    );

    return (
        <Box width="100%" height="500px" marginTop={2}>
            <Typography variant="h5" align="center">Mood Calendar</Typography>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                components={{ event: EventComponent }}
            />
        </Box>
    );
};

export default Calendar;
