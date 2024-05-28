import { check } from "k6";
import http from "k6/http";

export const options = {
  scenarios: {
    users_reading_profile: {
      executor: "constant-vus",
      vus: 30,
      duration: "30s",
    },
    hard_users_reading_profile: {
      executor: "constant-vus",
      vus: 100,
      duration: "1m",
    },
  },
};

const apiKey =
  "e24dd2210803b4737a9bd9e3163a4ca807b63201c3bc32b68fb122ca52efff36";
const testersBodies = [
  JSON.stringify({
    username: "K6Test",
    email: "loadtester01@alu.ufc.br",
    password: "Test1234",
    matricula: "000001",
    role: 0,
    codeCurso: 1,
  }),
  JSON.stringify({
    username: "K6Test",
    email: "loadtester02@alu.ufc.br",
    password: "Test1234",
    matricula: "000002",
    role: 0,
    codeCurso: 1,
  }),
  JSON.stringify({
    username: "K6Test",
    email: "loadtester03@alu.ufc.br",
    password: "Test1234",
    matricula: "000003",
    role: 0,
    codeCurso: 1,
  }),
  JSON.stringify({
    username: "K6Test",
    email: "loadtester04@alu.ufc.br",
    password: "Test1234",
    matricula: "000004",
    role: 0,
    codeCurso: 1,
  }),
  JSON.stringify({
    username: "K6Test",
    email: "loadtester05@alu.ufc.br",
    password: "Test1234",
    matricula: "000005",
    role: 0,
    codeCurso: 1,
  }),
];

const defaultRequestParams = {
  headers: {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  },
};

export function setup() {
  const registrationUrl = "http://localhost:7125/auth/register";

  testersBodies.forEach((body) => {
    //Create test users
    http.post(registrationUrl, body, defaultRequestParams);
  });
}

export default function () {
  const url = "http://localhost:7125/user/profile";

  const userAuthToken = loginRadomTestUser();

  const params = {
    headers: {
      "x-api-key": apiKey,
      Authorization: `Bearer ${userAuthToken}`,
    },
  };

  const resp = http.get(url, params);

  check(resp, { "status 200": (r) => r.status === 200 });
  check(resp, { hasKey: (r) => r.body != null && r.body.length > 0 });
}

function loginRadomTestUser(): string | null {
  const loginUrl = "http://localhost:7125/auth/login";
  const randomTestUserIndex = Math.floor(Math.random() * testersBodies.length);
  const randomTestUser = testersBodies[randomTestUserIndex];

  const loginReponse = http.post(
    loginUrl,
    randomTestUser,
    defaultRequestParams
  );

  if (loginReponse.status !== 200 || loginReponse.body === null) {
    return null;
  }

  const loginReponseBody = loginReponse.body as string;
  return loginReponseBody
}
