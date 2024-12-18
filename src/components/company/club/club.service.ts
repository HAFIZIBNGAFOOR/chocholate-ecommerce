import { badImplementationException, dataConflictException, HttpException } from '../../../utils/apiErrorHandler';
import { ClubFilterSearch, ClubSponsorDocument, NewClubSponsorDocument } from '../../../models/@types';
import { addClubSponsor, ClubSponsorRevoke, getClubSponsorByIDs } from '../../../models/clubSponsor';
import { getClubsWithFilter } from '../../../models/club';
import { getCurrentJST } from '../../../utils/dayjs';
import mongoose from 'mongoose';

export const getClubs = async (limit: number, offset: number, inputSearch: ClubFilterSearch) => {
  try {
    const clubs = await getClubsWithFilter(limit, offset, inputSearch);
    if (!clubs) throw dataConflictException('This sponsor is already made.');

    return Promise.resolve(clubs);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const sendOffer = async (isSponsor: ClubSponsorDocument | null, newSponsorship: NewClubSponsorDocument) => {
  let error: Error | HttpException | undefined, session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    isSponsor
      ? await ClubSponsorRevoke(newSponsorship, { status: 'revoke', deletedAt: new Date(getCurrentJST()) }, session)
      : await addClubSponsor(newSponsorship, session);

    await session.commitTransaction();
  } catch (err) {
    error = err instanceof Error ? err : badImplementationException(err);
    if (session) await session.abortTransaction();
    return Promise.reject();
  } finally {
    if (session) session.endSession();
  }
  if (!error) {
    return Promise.resolve();
  }
};
