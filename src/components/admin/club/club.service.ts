import { HttpException, badImplementationException, dataConflictException } from '../../../utils/apiErrorHandler';
import {
  ClubFilterSearch,
  NewClubDocument,
  NewClubMemberDocument,
  NewClubPromotionDocument,
  NewClubSponsorDocument,
  NewUserDocument,
  UpdateClubDocument,
  UpdateClubPromotionDocument,
} from '../../../models/@types';
import { addClubSponsor, getClubSponsorByIDs } from '../../../models/clubSponsor';
import { addClub, getClubsWithFilter, updateClubFields } from '../../../models/club';
import { Admins } from '../../../models/admin/admin.entity';
import { Users } from '../../../models/user/user.entity';
import { addUser } from '../../../models/user';
import { addClubMember } from '../../../models/clubMember';
import { sendMessage } from '../../../utils/sgMailer';
import { CONFIRM_REGISTRATION_MESSAGE } from './clubMember.message';
import { generatedId } from '../../../utils/randomId';
import { addNotification } from '../../../models/notification';
import { addClubPromotion, updateClubPromotionFields } from '../../../models/clubPromotion';
import mongoose from 'mongoose';
import { sentMail } from '../../../utils/nodemailer';

export const getClubs = async (limit: number, offset: number, inputSearch: ClubFilterSearch) => {
  try {
    const clubs = await getClubsWithFilter(limit, offset, inputSearch, true) //TODO: memo text for admin side;
    if (!clubs) throw dataConflictException('This sponsor is already made.');

    return Promise.resolve(clubs);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createClub = async (
  newClub: NewClubDocument,
  newUser: NewUserDocument,
  newPromo: NewClubPromotionDocument,
) => {
  let error: Error | HttpException | undefined, session, data;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    await addClub(newClub, session);
    await addUser(newUser, session);
    await addClubPromotion(newPromo, session);
    await addNotification({ notificationId: generatedId(), userId: newUser.userId, readBy: true }, session);

    await session.commitTransaction();
  } catch (err) {
    error = err instanceof Error ? err : badImplementationException(err);

    if (session) await session.abortTransaction();
    return Promise.reject(error);
  } finally {
    if (session) session.endSession();
  }
  if (!error) {
    await sentMail(CONFIRM_REGISTRATION_MESSAGE(newUser.email, newUser.password));
    return Promise.resolve();
  }
};

export const updateClub = async (clubId: string, club: UpdateClubDocument, clubPromo: UpdateClubPromotionDocument) => {
  let error: Error | HttpException | undefined, session, data;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
    await updateClubFields(clubId, club, session);

    await updateClubPromotionFields(clubId, clubPromo, session);
    await session.commitTransaction();
  } catch (err) {
    error = err instanceof Error ? err : badImplementationException(err);

    if (session) await session.abortTransaction();
    return Promise.reject(error);
  } finally {
    if (session) session.endSession();
  }
  if (!error) {
    return Promise.resolve();
  }
};
export const createClubMember = async (newUser: NewUserDocument, newMember: NewClubMemberDocument) => {
  let error: Error | HttpException | undefined, session, data;
  try {
    session = await Users.startSession();
    session.startTransaction();

    await addClubMember(newMember, session);
    await addUser(newUser, session);
    await addNotification({ notificationId: generatedId(), userId: newUser.userId, readBy: true }, session);

    await session.commitTransaction();
  } catch (err) {
    error = err instanceof Error ? err : badImplementationException(err);

    if (session) await session.abortTransaction();
  } finally {
    if (session) session.endSession();
  }
  if (error) {
    console.error(error);
    return Promise.reject(error);
  } else {
    await sentMail(CONFIRM_REGISTRATION_MESSAGE(newUser.email, newUser.password));

    if (data) return Promise.resolve(data);
    else return Promise.resolve();
  }
};
