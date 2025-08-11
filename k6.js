import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://myapp-route-wirajayaabadi-dev.apps.rm2.thpm.p1.openshiftapps.com/pages/hello'; // Ganti dengan Route kamu

export let options = {
  stages: [
    { duration: '1m', target: 1000 },  // 10 users selama 1 menit
  ],
};

export default function () {
  http.get(BASE_URL);
  sleep(1);
}

