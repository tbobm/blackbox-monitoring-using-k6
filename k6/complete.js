import http from 'k6/http';
import { check } from 'k6';

const API_URL = __ENV.API_URL;

export function setup() {
  const headers = {'Content-Type': 'application/json'};
  const loginRes = http.post(`${API_URL}/login`, JSON.stringify({
    username: 'user',
    password: 'secret-password',
  }), headers);
  check(loginRes, {
    'login successful': (res) => res.status === 200,
    'JWT token received': (res) => JSON.parse(res.body).token !== undefined,
  });
  const token = JSON.parse(loginRes.body).token;
  return { token };  // only return access token
}

export function getAlbums (data) {
  const headers = {
    headers: {
      'Authorization': `Bearer ${data.token}`,
      'Content-Type': 'application/json',
    }
  };

  const resAlbums = http.get(`${API_URL}/albums`, headers);
  check(resAlbums, {
    'list retrieval successful': (res) => res.status === 200,
    'contains expected data': (res) =>
      JSON.parse(res.body).albums && JSON.parse(res.body).albums.length > 0,
  });
}

export function uploadMedia (data) {
  const headers = {
    headers: {
      'Authorization': `Bearer ${data.token}`,
      'Content-Type': 'application/json',
    }
  };
  // Define the payload for the upload
  const payload = {
    filetype: 'image/png',
    data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgEBAgkAATQAAAABJRU5ErkJggg==',
  };
  const uploadRes = http.post(
    `${API_URL}/upload-media`,
    JSON.stringify(payload),
    headers
  );
  check(uploadRes, {
    'upload successful': (res) => res.status === 200,
    'returns expected result': (res) =>
      JSON.parse(res.body).status === 'processing',
  });
}

export default function (data) {
  getAlbums(data);
  uploadMedia(data);
}
