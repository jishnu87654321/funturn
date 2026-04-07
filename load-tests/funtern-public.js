import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    baseline_public: {
      executor: 'constant-vus',
      vus: 100,
      duration: '10m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000', 'p(99)<5000'],
  },
};

export default function () {
  const homepage = http.get(`${BASE_URL}/`);
  check(homepage, { 'homepage ok': (response) => response.status === 200 });

  const applyPage = http.get(`${BASE_URL}/apply`);
  check(applyPage, { 'apply page ok': (response) => response.status === 200 });

  const categories = http.get(`${BASE_URL}/api/categories`);
  check(categories, { 'categories ok': (response) => response.status === 200 });

  sleep(1);
}
