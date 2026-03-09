import { io } from 'socket.io-client';

export const connectSocket = (token: string) => {
  return io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    auth: {
      token,
    },
  });
};