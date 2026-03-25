import http from 'k6/http';
import { check, sleep } from 'k6';

const url = 'https://httpbin.org';
const vus = 100;
const reqs = vus * 0.7;

export let options = {
  vus: vus,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<400'],
    http_req_failed: ['rate==0'],
    http_reqs: [`rate>${reqs}`],
  },
};

export default function () {
  let response = http.get(`${url}/get1`);
  sleep(1);

  check(response, {
    'Статус 200': (response) => response.status === 200,
  });

  if (response.status != 200) {
    console.log(response.status);
  }
}
