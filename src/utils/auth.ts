import { Request, Response, NextFunction } from 'express';
import { socketErrorHandle, unauthorizedException } from './apiErrorHandler';
import { decodeJwt, decodeJwtSocket } from './jwt';
import { getUserByID, updateUserFields } from '../models/user';
import { setAdmin, setUser } from './helper';
import { getAdminByID } from '../models/admin';
import { Socket } from 'socket.io';
import { SocketData } from '../@types';
import { io, sendMessages, typingMessage, userStatusBroadCast } from '../middleware/socket';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log(req.headers)
    const bearer = req.headers['authorization'];
    if (!bearer) throw unauthorizedException('No token provided');

    const token = bearer.split(' ')[1];
    const decoded = decodeJwt(token, 'access');

    const user = await getUserByID(decoded.payload.id);
    if (!user) throw unauthorizedException('User is not exist');
    if (user.status !== 'active' || user.deletedAt !== null) throw new Error('1016');

    req.user = setUser(user);
    next();
  } catch (err) {
    console.warn(err);
    next(err);
  }
};

export const isCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers['authorization'];
    if (!bearer) throw unauthorizedException('No token provided');

    const token = bearer.split(' ')[1];
    const decoded = decodeJwt(token, 'access');

    const user = await getUserByID(decoded.payload.id);
    if (!user) throw unauthorizedException('User is not exist');
    if (user.status !== 'active' || user.deletedAt !== null) throw new Error('1016');

    if (user.userType !== 'companyAdmin') throw unauthorizedException('This user is not company admin');

    req.user = setUser(user);
    next();
  } catch (err) {
    console.warn(err);
    next(err);
  }
};

export const isClubMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers['authorization'];
    if (!bearer) throw unauthorizedException('No token provided');

    const token = bearer.split(' ')[1];
    const decoded = decodeJwt(token, 'access');

    const user = await getUserByID(decoded.payload.id);
    if (!user) throw unauthorizedException('User is not exist');
    if (user.status !== 'active' || user.deletedAt !== null) throw new Error('1016');

    if (user.userType !== 'clubMember') throw unauthorizedException('This user is not company admin');

    req.user = setUser(user);
    next();
  } catch (err) {
    console.warn(err);
    next(err);
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers['authorization'];
    if (!bearer) throw unauthorizedException('No token provided');

    const token = bearer.split(' ')[1];
    const decoded = decodeJwt(token, 'access');

    const admin = await getAdminByID(decoded.payload.id);
    if (!admin) throw unauthorizedException('Admin is not exist');
    if (admin.deletedAt !== null) throw new Error('1016');

    req.admin = setAdmin(admin);
    next();
  } catch (err) {
    console.warn(err);
    next(err);
  }
};

export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers['authorization'];
    if (!bearer) throw unauthorizedException('No token provided');

    const token = bearer.split(' ')[1];
    const decoded = decodeJwt(token, 'access');

    const admin = await getAdminByID(decoded.payload.id);
    if (!admin) throw unauthorizedException('Admin is not exist');
    if (admin.privilege !== 'superAdmin') throw unauthorizedException('This admin is not a Super admin');
    if (admin.deletedAt !== null) throw new Error('1016');

    req.admin = setAdmin(admin);
    next();
  } catch (err) {
    console.warn(err);
    next(err);
  }
};

export const isClubAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers['authorization'];
    if (!bearer) throw unauthorizedException('No token provided');

    const token = bearer.split(' ')[1];
    const decoded = decodeJwt(token, 'access');

    const user = await getUserByID(decoded.payload.id);
    if (!user) throw unauthorizedException('User is not exist');
    if (user.status !== 'active') throw unauthorizedException('This user is suspend');

    if (user.status !== 'active' || user.deletedAt !== null) throw new Error('1016');

    req.user = setUser(user);
    next();
  } catch (err) {
    console.warn(err);
    next(err);
  }
};

export const userSocketAuth = async (socket: Socket) => {
  try {
    const token = socket.handshake.headers.refreshtoken as string;
    const sessionId = socket.handshake.headers.sessionid as string;
    socket.leave(sessionId);
    socket.join(sessionId);

    if (!token) return socketErrorHandle(sessionId, 'token is empty', '1019');

    const decoded = decodeJwtSocket(token, 'refresh', sessionId);
    if (!decoded) return socketErrorHandle(sessionId, 'jwt wrong', '5000');

    const user = await getUserByID(decoded.payload.id);
    if (!user) return socketErrorHandle(sessionId, 'User is not exist', '2001');

    if (user.status !== 'active') return socketErrorHandle(sessionId, 'This user is suspend', '2001');

    if (user.deletedAt !== null) return socketErrorHandle(sessionId, 'This user is deleted', '2001');

    const userId = user.userId;
    const userRole = user.userType;
    socket.data.userId = userId;
    socket.data.role = userRole;
    const online = io.engine.clientsCount;
    console.log(`user Connection online: ${online}`);
    socket.leave(userId);
    socket.join(userId);
    console.log('=========join user ==========');
    console.log('userId', userId);
    console.log('=========join user ==========');

    userStatusBroadCast(userId, 'online'); // board other user
    await updateUserFields(userId, { chatStatus: 'online' });

    socket.on('sendMessage', (message: SocketData) => {
      const data = message;
      data.sender = socket.data.userId;
      sendMessages(data.receiver, data);
    });

    socket.on('typingMessage', (message: SocketData) => {
      const data = message;
      data.sender = socket.data.userId;
      typingMessage(data.receiver, data); // 1 param is receiverId to address, senderId 2 param  from address , 3 param boolean value
    });

    socket.on('disconnect', async () => {
      const offline = io.engine.clientsCount - 1;
      console.log(`user Disconnected : ${offline}`);
      console.log(`user id : ${socket.data.userId}`);
      userStatusBroadCast(userId, 'offline'); // board other user
      await updateUserFields(userId, { chatStatus: 'offline' });
    });
  } catch (error) {
    console.log(error);
  }
};
