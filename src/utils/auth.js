const token = 'x-token'
const mobile = 'x-mobile'
export function setLocalToken(data) { 
  return localStorage.setItem(token,JSON.stringify(data))
}
export function getLocalToken() {
  return JSON.parse(localStorage.getItem(token))
}
export function removeLocalToken() {
  return localStorage.removeItem(token)
}
export function setSessionToken(data) {
  return sessionStorage.setItem(token, JSON.stringify(data))
}
export function getSessionToken() {
  return JSON.parse(sessionStorage.getItem(token))
}
export function removeSessionToken() {
  return sessionStorage.removeItem(token)
}
export function setMobile(data) { 
  return localStorage.setItem(mobile,JSON.stringify(data))
}
export function getMobile() {
  return JSON.parse(localStorage.getItem(mobile))
}
export function removeMobile() {
  return localStorage.removeItem(mobile)
}