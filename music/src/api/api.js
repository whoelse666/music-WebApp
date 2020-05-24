import http from './http'
export function getMusic(id) {
  return http.get('/musicInfo',{id})
}