import Reactotron from 'reactotron-react-native';
import { URL_SERVER} from './Constants'

class Api {
  static requestHeaders(token) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      dataType: 'json',
      Authorization: 'Bearer ' + token,
    };
  }

  static get(route, token) {
    const headers = Object.assign(this.requestHeaders(token));

    return fetch(URL_SERVER + route, {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        return response.json();
      })
      .catch(error => {
        return error;
      });
  }

  static put(route, params) {
    //return this.xhr(route, params, 'PUT')
  }

  static async post(route, params, token) {
    //return this.xhr(route, params, 'POST')

    const headers = Object.assign(this.requestHeaders(token));

    let resp = [];

    await fetch(URL_SERVER + route, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params),
    })
      .then(response => {
        if (response.status === 400) {
          //alert("Error: " + response.response.statusText)
          let respuesta = response.json();

          resp = respuesta;
        } else if (response.status === 404) {
          //alert("Error: " + response.statusText)
          resp = {response: {message: 'Not found'}};
        } else if (response.status === 500) {
          //alert("Error: " + response.statusText)
          resp = {
            response: {
              message: 'Error en el servidor, intente de nuevo mas tarde',
            },
          };
        } else if (response.status === 0) {
          //alert("Error: " + response.statusText)
          resp = {
            response: {
              message: 'Error en el servidor, intente de nuevo mas tarde',
            },
          };
        } else {
          resp = response.json();
        }

        //
      })
      .catch(error => {
        resp = {
          response: {
            message: 'Error en el servidor, intente de nuevo mas tarde',
          },
        };
      });

    return resp;
  }

  static delete(route, params) {
    //return this.xhr(route, params, 'DELETE')
  }

  //'http://ec2-35-164-227-121.us-west-2.compute.amazonaws.com/api/'
}
export default Api;
