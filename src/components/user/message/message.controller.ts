import { Request, Response, NextFunction } from 'express';
import * as Service from './message.service';
import { getMessageInbox, updateDiscussionFields } from '../../../models/discussion';
import {
  getMessageByDiscussionId,
  getMessageByReceiverId,
  updateMessageAllByDiscussionId,
  updateMessageOneMessageId,
} from '../../../models/message';
import { NewDiscussionDocument, NewMessageDocument, NewNotificationDocument } from '../../../models/@types';
import { generatedId } from '../../../utils/randomId';
import { handleResponse } from '../../../middleware/requestHandle';
import { badImplementationException, unauthorizedException } from '../../../utils/apiErrorHandler';

import * as service from './message.service';
import { getNotificationByUserId, updateNotification } from '../../../models/notification';

export const createDiscussion = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // Get userId in userAuth  and receiver and message in body.
    const { userId } = req.user;
    const { receiver, message } = req.body;

    // Checks userId exists.
    if (!userId) throw badImplementationException('authorization process has something wrong.');

    //step3: Creates new discussion document, message document and notification document.
    const newDiscussion: NewDiscussionDocument = {
      discussionId: generatedId(),
      members: [userId, receiver],
      latestMessage: message,
      readBy: false,
      deletedAt: null,
    };

    const newMessage: NewMessageDocument = {
      messageId: generatedId(),
      discussionId: newDiscussion.discussionId,
      members: [userId, receiver],
      sender: userId,
      receiver,
      message,
      readBy: false,
      deletedAt: null,
    };
    const newNotification: NewNotificationDocument = {
      notificationId: generatedId(),
      userId: receiver,
      readBy: false,
    };

    //step4: Create new message using discussion, message and notification document with createMessage service.
    const result = await service.createMessage(newDiscussion, newMessage, newNotification);
    return handleResponse(res,200,{discussion:result?.discussionId})
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getDiscussion = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //  Get userId in userAuth and limit and offset in query
    const { userId } = req.user;
    const { limit, offset } = req.query;

    //Checks whether limit, offset and userId exists
    if (!limit || !offset) throw new Error('1034');
    if (!userId) throw new Error('1002');
    console.log(userId);

    //Get message from discussion collection .
    const getMessage = await getMessageInbox(userId, Number(limit), Number(offset));
    return handleResponse(res, 200, { data: { getMessage } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateDiscussion = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //  Get discussionId in params.
    const { discussionId } = req.params;

    // checks discussionId exists
    if (!discussionId) throw new Error('1040');

    // Updates discussion in  discussion collection.
    await updateDiscussionFields(discussionId, { readBy: true });
    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getMessageDiscussionId = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //  Get userId in userAuth ,limit and offset in query and discussionId in params.
    const { userId } = req.user;
    const { limit, offset } = req.query;
    const { discussionId } = req.params;

    // checks whether limit offset and userId exists
    if (!limit || !offset) throw new Error('1034');
    if (!userId) throw new Error('1002');

    // Get messages from  messages collection.
    const result = await getMessageByDiscussionId(discussionId, userId, Number(limit), Number(offset));
    return handleResponse(res, 200, { data: { getMessage: result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const readByMessageUpdateAll = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // Get userId in userAuth and discussionId in params.
    const { userId } = req.user;
    const { discussionId } = req.params;

    // Checks whether userId exists
    if (!userId) throw new Error('1002');

    //  Updates messages by discussionId in messages collection.
    await updateMessageAllByDiscussionId(discussionId, userId);

    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const readByMessageUpdateOne = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // Get userId in userAuth and discussionId in params.
    const { userId } = req.user;
    const { messageId } = req.params;

    //  Checks whether userId exists
    if (!userId) throw new Error('1002');

    //  Updates messages by discussionId in messages collection.  
    await updateMessageOneMessageId(messageId);
    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getMessageReceiversId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  Get userId in userAuth ,limit and offset in query and receiverId in params.
    const { userId } = req.user;
    const { receiverId } = req.params;
    const { limit, offset } = req.query;
    if (!userId) throw new Error('1002');
    if (!limit || !offset) throw new Error('1034');

    // Get messages recieved by id from  messages collection.
    const result = await getMessageByReceiverId(receiverId, userId, Number(limit), Number(offset));
    return handleResponse(res, 200, { data: { getMessage: result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //Get userId in userAuth.
    const { userId } = req.user;

    // Check whether userId exists
    if (!userId) throw unauthorizedException('User ID is not defined.');
    
    // Get notification by userId from notification collection .
    const result = await getNotificationByUserId(userId);
    return handleResponse(res, 200, { data: { result } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateMessageNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //   Get userId in userAuth.
    const { userId } = req.user;

    //  Check whether userId exists
    if (!userId) throw unauthorizedException('User ID is not defined.');
    
    // Updates notification from notification collection .
    await updateNotification(userId, { readBy: true });
    return handleResponse(res, 200, {});
  } catch (err) {
    console.error(err);
    next(err);
  }
};
