import http from 'k6/http'
import { check, sleep } from 'k6'

const API_URL = __ENV.API_URL

export default function () {
  const data = { username: 'username', password: 'password' }

  let res = http.post(`${API_URL}/login`, JSON.stringify(data), {"Content-Type": "application/json"})

  check(res, { 'success login': (r) => r.status === 200 })

  sleep(0.3)
}
