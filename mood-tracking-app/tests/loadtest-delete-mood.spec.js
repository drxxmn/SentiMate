import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 50 }, // ramp-up to 50 users
        { duration: '1m', target: 50 },  // stay at 50 users for 1 minute
        { duration: '30s', target: 0 },  // ramp-down to 0 users
    ],
};

// Fetch all mood entries
export function setup() {
    let res = http.get('http://192.168.144.135/api/mood');
    return res.json(); // Return all entries as setup data
}

export default function (data) {
    // Iterate over all entries and delete each one
    data.forEach(entry => {
        let res = http.del(`http://192.168.144.135/api/mood/${entry.id}`);
        check(res, {
            'status is 200': (r) => r.status === 200,
        });
        sleep(1);
    });
}
