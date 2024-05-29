import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 50 }, // ramp-up to 50 users
        { duration: '1m', target: 50 },  // stay at 50 users for 1 minute
        { duration: '30s', target: 0 },  // ramp-down to 0 users
    ],
};

// Function to get a list of mood entries to delete
function getMoodEntries() {
    const url = 'http://192.168.144.135/api/mood';
    const res = http.get(url);
    return JSON.parse(res.body);
}

export default function () {
    const moodEntries = getMoodEntries();
    if (moodEntries.length > 0) {
        const entry = moodEntries[Math.floor(Math.random() * moodEntries.length)];
        const url = `http://192.168.144.135/api/mood/${entry.id}`;
        const res = http.del(url);
        check(res, {
            'status is 204': (r) => r.status === 204,
        });
    }
    sleep(1);
}
