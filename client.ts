import io from 'socket.io-client';

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiYWNjYWQyNWYtNzMxMi00NDVmLWFiNmMtZTY4NTYyYmY0OTJhIn0sImlhdCI6MTcwMTQ2ODY2OSwiZXhwIjoxNzAxNDY5NTY5fQ.hjpvaf6dYwCXNho8h7wP-EkeNYLhWsM_V8XkKjc6KBQ';
const socket = io('http://localhost:8000/api/user/socket', {
  withCredentials: true,
  extraHeaders: {
    refreshToken: accessToken,
    sessionId: 'q43',
  },

  //   extraHeaders: {
  //     'my-custom-header': 'abcd',
  //   },
});
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// app.get('/send', (req, res) => {
//   res.sendFile(__dirname + '/index1.html');
// });

// socket.emit('message', message);
// socket.on('message', (data) => {
//   console.log('work join', data);
// });
socket.on('error', (data) => {
  console.log('error', data);
});

// setInterval(() => {
//   socket.emit('message', {
//     userId: 'accad25f-7312-445f-ab6c-e68562bf492a',
//     message: 'work fine',
//   });
// }, 1000);

socket.on('userStatus', (data) => {
  console.log(data);
});
socket.on('chat', (userId, message) => {
  console.log('message', userId, message);
});

// The expected output is one two, after a delay of 1 second.
