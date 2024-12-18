import { Request, Response, NextFunction } from 'express';
import { unauthorizedException } from '../../../utils/apiErrorHandler';
import { getCurrentJST } from '../../../utils/dayjs';
import { getClubByID, getClubMemberByID, updateClubFields } from '../../../models/club';
import { updateUserFields } from '../../../models/user';
import { NewClubPromotionDocument } from '../../../models/@types';
import { v4 as uuidv4 } from 'uuid';
import { addClubPromotion, getClubPromotionByID, updateClubPromotionFields } from '../../../models/clubPromotion';
import { updateClubMemberFields } from '../../../models/clubMember';

export const getMemberProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get clubmemberId in clubMemberAuth
    const { clubMemberId } = req.user;

    // checks whether clubMemberId exists
    if (!clubMemberId) throw unauthorizedException('ClubMember Id is not defined.');

    // Get club memebrs by Id from Club members collection
    const club = await getClubMemberByID(clubMemberId);

    return res.status(200).json({ success: true, data: { club } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateMemberProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get clubmemberId in clubMemberAuth
    const { clubMemberId } = req.user;

    // checks whether clubMemberId exists
    if (!clubMemberId) throw unauthorizedException('Club ID is not defined.');

    // get clubMemberName, imageUrl, hometown, grade, major and personalTestResultUrl in body
    const { clubMemberName, imageUrl, hometown, grade, major, personalTestResultUrl } = req.body;

    // updates clubmember fields in club member collection
    await updateClubMemberFields(clubMemberId, {
      clubMemberName,
      imageUrl,
      hometown,
      grade,
      major,
      personalTestResultUrl,
    });

   return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
