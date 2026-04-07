import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    spike_public: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '60s', target: 1000 },
        { duration: '5m', target: 1000 },
        { duration: '60s', target: 0 },
      ],
      gracefulRampDown: '15s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<3000', 'p(99)<6000'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/`);
  check(response, { 'homepage ok': (item) => item.status === 200 });
  sleep(1);
}
