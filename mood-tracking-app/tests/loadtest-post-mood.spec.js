import http from 'k6/http';
import { check, sleep } from 'k6';
import { writeFileSync } from 'k6/x/fs';

export let options = {
    stages: [
        { duration: '30s', target: 50 }, // ramp-up to 50 users
        { duration: '1m', target: 50 },  // stay at 50 users for 1 minute
        { duration: '30s', target: 0 },  // ramp-down to 0 users
    ],
};

const moods = ["Happy", "Neutral", "Sad", "Very Happy", "Very Sad"];
let createdIds = [];

function getRandomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
    }
    return result;
}

function getRandomMood() {
    return moods[Math.floor(Math.random() * moods.length)];
}

export default function () {
    const url = 'http://192.168.144.135/api/mood';
    const payload = JSON.stringify({
        mood: getRandomMood(),
        userId: getRandomString(8)
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let res = http.post(url, payload, params);
    check(res, {
        'status is 201': (r) => r.status === 201,
    });

    // Store the ID of the created mood
    if (res.status === 201) {
        const responseBody = JSON.parse(res.body);
        createdIds.push(responseBody.id); // Assuming the response contains the ID in the 'id' field
    }

    sleep(1);
}

// Function to write the created IDs to a file
export function handleSummary(data) {
    console.log(JSON.stringify(createdIds)); // Log the created IDs
    writeFileSync('createdIds.json', JSON.stringify(createdIds));
    return {
        stdout: text(data), // Log summary to console
    };
}
