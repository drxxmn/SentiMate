import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

const createdIds = new SharedArray('createdIds', function () {
    return JSON.parse(open('./createdIds.json')); // Read the JSON file from the current directory
});

export let options = {
    stages: [
        { duration: '30s', target: 50 }, // ramp-up to 50 users
        { duration: '1m', target: 50 },  // stay at 50 users for 1 minute
        { duration: '30s', target: 0 },  // ramp-down to 0 users
    ],
};

export default function () {
    const url = 'http://192.168.144.135/api/mood/';

    for (const id of createdIds) {
        let res = http.del(url + id);

        check(res, {
            'status is 200': (r) => r.status === 200,
        });

        sleep(0.1); // Slight pause to prevent overwhelming the server
    }
}
