import { io } from 'socket.io-client';

export const connectSocket = (token: string) => {
  return io('http://localhost:3001', {
    auth: {
      token,
    },
  });
};