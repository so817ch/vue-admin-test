import request from '@/utils/request';

export function getChartData() {
  return request({
    url: '/chart/data',
    method: 'get',
  });
}
