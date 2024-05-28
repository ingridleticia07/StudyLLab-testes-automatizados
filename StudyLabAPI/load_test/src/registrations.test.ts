import { check } from "k6";
import http from "k6/http";
import { generate } from "random-words";

export const options = {
  scenarios: {
    soft_registrations: {
      executor: 'shared-iterations',
      
      gracefulStop: '15s',

      vus: 10,
      iterations: 100,
      maxDuration: '30s',
    },
    hard_registration_peek: {
      executor: 'ramping-vus',

      startTime: '30s',
      gracefulStop: '15s',

      startVUs: 1,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 20 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '40s',
    },
  },
};

export default function () {
  const url = "http://localhost:7125/auth/register";
  const apiKey =
    "e24dd2210803b4737a9bd9e3163a4ca807b63201c3bc32b68fb122ca52efff36";

  const requestUserEmail = generateEmail();
  const requestUserMatricula = generateMatricula();
  const body = JSON.stringify({
    username: "K6Test",
    email: requestUserEmail,
    password: "Test1234",
    matricula: requestUserMatricula,
    role: 0,
    codeCurso: 1,
  });
  const params = {
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json"
    },
  };

  const resp = http.post(url, body, params);
  check(resp, { "status 201": (r) => r.status === 201 });
  check(resp, { hasKey: (r) => r.body != null && r.body.length > 0 });
}

function generateEmail() {
  const domain = "@alu.ufc.br";

  return generate() + domain;
}

function generateMatricula() {
  const size = 6;
  let matricula = "";

  for (let i = 0; i < size; i++) {
    matricula += Math.floor(Math.random() * 10);
  }

  return matricula;
}
