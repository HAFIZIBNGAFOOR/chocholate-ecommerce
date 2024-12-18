import { userSocketAuth } from '../utils/auth';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../@types';
import { Server } from 'socket.io';

import http from 'http';

export let io: Server;
export const SocketInitialize = (server: http.Server) => {
  io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    cors: {
      origin: '*',
    },
  });
  initSocket();
};

export const initSocket = () => {
  console.log('🚀 Web socket connection initialization');
  io.of('/api/user/socket').on('connection', userSocketAuth);
};

export const sendMessages = (receiver: string, message: SocketData) => {
  return io.of('/api/user/socket').to(receiver).emit('receiveMessage', message);
};

export const typingMessage = (receiver: string, message: SocketData) => {
  return io.of('/api/user/socket').to(receiver).emit('typingEvent', message);
};

export const userStatusBroadCast = (receiver: string, status: 'online' | 'offline') => {
  return io.of('/api/user/socket').emit('userStatus', receiver, status);
};

export const messageStatus = (discussionId: string, message: SocketData) => {
  return io.of('/api/user/socket').to(discussionId).emit('messageStatus', message);
};

export const discussionStatus = (discussionId: string, message: SocketData) => {
  return io.of('/api/user/socket').to(discussionId).emit('discussion', message);
};
