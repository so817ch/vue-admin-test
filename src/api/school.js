import request from '@/utils/request'

export function getAllSchool() {
  return request({
    url: '/school',
    method: 'get',
    params:{}
  })
}