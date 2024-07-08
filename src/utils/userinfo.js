
export function getMyId(token) {
  const base64Url = token.split('.')[1]; // Token的第二部分是有效载荷
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64)); // atob()用于解码Base64字符串

  // 获取用户ID
  const userId = payload.id;
  return userId;
}