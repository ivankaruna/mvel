import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<400'],
    http_req_failed: ['rate==0'],
    http_reqs: ['rate>80'],
  },
};

export default function () {
  let response = http.get('https://httpbin.org/get1');
  sleep(1);

  check(response, {
    'Статус 200': (response) => response.status === 200,
  });
}
