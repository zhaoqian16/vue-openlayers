import axios from 'axios'

export function sendPOST(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function sendGET(url, param) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params: param})
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch(error => {
        reject(error)
      })
  })
}
