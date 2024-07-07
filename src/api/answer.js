import request from '@/utils/request'

export function getAnswerPage(pageForm) {
  return request({
    url: '/answer/page',
    method: 'post',
    data: pageForm
  })
}

export function deleteAnswer(ids) {
  return request({
    url: `/answer/delete/${ids.join(',')}`,
    method: 'delete',
  })
}

export function addAnswer(form) {
  return request({
    url: `/answer/add`,
    method: 'post',
    data: form
  })
}

export function updateAnswer(form) {
  return request({
    url: `/answer/update`,
    method: 'put',
    data: form
  })
}

export function getAnswer(id) {
  return request({
    url: `/answer/get/${id}`,
    method: 'get',
  })
}

export function judgeAnswer(ids) {
  return request({
    url: `/answer/judge/${ids.join(',')}`,
    method: 'get',
  })
}