import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { text } from 'k6/encoding';

export let options = {
    stages: [
        { duration: '30s', target: 50 }, // ramp-up to 50 users
        { duration: '1m', target: 50 },  // stay at 50 users for 1 minute
        { duration: '30s', target: 0 },  // ramp-down to 0 users
    ],
};

const moods = ["Happy", "Neutral", "Sad", "Very Happy", "Very Sad"];

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
        mood: getRandomMood(), // Random mood from predefined values
        userId: getRandomString(8) // Random userId string
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let res = http.post(url, payload, params);
    check(res, {
        'status is 201': (r) => r.status === 201,
        'response time is less than 200ms': (r) => r.timings.duration < 200,
    });

    if (res.status === 201) {
        // Save the ID of the created mood entry
        const responseBody = JSON.parse(res.body);
        const createdId = responseBody.id;
        console.log(createdId); // Log the ID, or save it to a file
        // You can use k6's built-in shared array or file system to save IDs
    }

    sleep(1);
}
