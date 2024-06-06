import http from 'k6/http';
import { check, sleep } from 'k6';

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

// Function to create a mood entry
function createMoodEntry() {
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

    const res = http.post(url, payload, params);
    check(res, {
        'status is 201': (r) => r.status === 201,
    });
    return JSON.parse(res.body).id; // Return the ID of the created entry
}

// Function to delete a mood entry
function deleteMoodEntry(id) {
    const url = `http://192.168.144.135/api/mood/${id}`;
    const res = http.del(url);
    check(res, {
        'status is 204': (r) => r.status === 204,
    });
}

export default function () {
    // Step 1: Create a mood entry
    const id = createMoodEntry();

    // Step 2: Wait for a moment before deleting
    sleep(1);

    // Step 3: Delete the created mood entry
    deleteMoodEntry(id);

    // Step 4: Wait for a moment before next iteration
    sleep(1);
}
