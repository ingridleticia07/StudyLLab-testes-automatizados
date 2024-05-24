import { check } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 10,
  duration: '15s',
};

export default function () {
  const url = "http://localhost:7125/utils/health";
  const apiKey =
    "e24dd2210803b4737a9bd9e3163a4ca807b63201c3bc32b68fb122ca52efff36";
  const params = {
    headers: {
      "x-api-key": apiKey,
    },
  };

 const resp = http.get(url, params);
 check(resp, { "status 200": (r) => r.status === 200})
}