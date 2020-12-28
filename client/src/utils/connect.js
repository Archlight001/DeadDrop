import axios from "axios";

export function apiCall(method, path, data) {
  return new Promise((resolve, reject) => {
    return axios({ method: method.toLowerCase(), url: path, data: data })
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err.response);
      });
  });
}
