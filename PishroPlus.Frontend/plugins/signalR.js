
import * as signalR from '@microsoft/signalr';


const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://172.22.1.215:7072/signalr', {
    headers: {
      'token': localStorage.getItem('auth_token')
    },
    withCredentials: false
  })
  .build();

connection.start().then(() => {
  console.log('Connection started');
}).catch(err => console.error('Error while starting connection: ' + err));


export default connection



