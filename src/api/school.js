import request from '@/utils/request'

export function getAllSchool() {
  return request({
    url: '/school',
    method: 'get',
    params:{}
  })
}

export function getSchoolPage(pageForm) {
  return request({
    url: '/school/page',
    method: 'post',
    data:pageForm
  })
}