import http from 'k6/http';
import { check, sleep } from 'k6';

const url = 'https://httpbin.org/';
const vus = 100;
const reqs = vus * 0.7;

const LOGIN = 'user';
const PASSWORD = 'pass';

export let options = {
  vus: vus,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    http_reqs: [`rate>${reqs}`],
  },
};

export function setup() {
  const requestData = {
    username: LOGIN,
    password: PASSWORD,
  };

  const body = JSON.stringify(requestData);
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let authResponse = http.post(`${url}/post`, body, params);

  check(authResponse, {
    'Авторизация успешна (статус 200)': (response) => response.status === 200,
  });

  let token;
  try {
    const json = authResponse.json();
    token = json.token || 'test-token';
  } catch (error) {
    console.error('Не удалось получить токен');
  }

  return { token };
}

export default function (data) {
  const token = data.token;

  if (!token) {
    console.error('Токен не получен');
    return;
  }

  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = http.get(`${url}/bearer`, params);

  check(response, {
    'Статус 200': (r) => r.status === 200,
  });

  sleep(1);
}
