import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 50 }, // ramp-up to 50 users
        { duration: '1m', target: 50 },  // stay at 50 users for 1 minute
        { duration: '30s', target: 0 },  // ramp-down to 0 users
    ],
};

export default function () {
    let res = http.get('http://192.168.144.135/api/mood');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time is less than 200ms': (r) => r.timings.duration < 200,
    });
    sleep(1);
}
