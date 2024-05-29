import http from 'k6/http';
import { check, sleep } from 'k6';

// Example data snippet (you can load this from an external file)
const moodEntries = [
    {"id":"66571a117b4580986bf7b8cf","mood":"Very Happy","timestamp":"2024-05-29T12:05:37.592Z","userId":"Yo0xKVEI"},
    {"id":"66571a117b4580986bf7b8d0","mood":"Very Sad","timestamp":"2024-05-29T12:05:37.623Z","userId":"M4HMvlaw"},
    {"id":"66571a117b4580986bf7b8d1","mood":"Neutral","timestamp":"2024-05-29T12:05:37.82Z","userId":"J6P4ZHSW"},
    // Add more entries as needed
];

export let options = {
    stages: [
        { duration: '30s', target: 10 }, // ramp-up to 10 users
        { duration: '1m30s', target: 50 }, // stay at 50 users
        { duration: '30s', target: 0 }, // ramp-down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<5000'], // 95% of requests should be below 5s
    },
};

export default function () {
    const baseUrl = 'http://192.168.144.135/api/mood'; // Replace with your actual API base URL

    moodEntries.forEach((entry) => {
        const url = `${baseUrl}/${entry.id}`;
        const res = http.del(url);

        console.log(`Deleting mood entry ${entry.id}, Status: ${res.status}`);

        check(res, {
            'is status 200': (r) => r.status === 200,
        });

        sleep(1); // Adjust sleep duration as needed
    });
}
