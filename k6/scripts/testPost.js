import http from 'k6/http';
import { check, sleep } from 'k6';

const url = 'https://httpbin.org';
const vus = 100;
const reqs = Math.floor(vus * 0.7);

export let options = {
  vus: vus,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<400'],
    http_req_failed: ['rate==0'],
    http_reqs: [`rate>${reqs}`],
  },
};

const requestData = {
  firstName: 'Ivan',
  lastName: 'Ivanov',
  city: 'Moskow',
};
const body = JSON.stringify(requestData);
const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function () {
  let response = http.post(`${url}/post`, body, params);
  sleep(1);

  check(response, {
    'Статус 200': (response) => response.status === 200,
    'Проверка тела ответа': (response) => {
      if (response.status !== 200) return false;
      try {
        const json = response.json();

        return (
          json.json.firstName === requestData.firstName &&
          json.json.lastName === requestData.lastName &&
          json.json.city === requestData.city
        );
      } catch (error) {
        return false;
      }
    },
  });

  if (response.status != 200) {
    console.log(response.status);
  }
}
