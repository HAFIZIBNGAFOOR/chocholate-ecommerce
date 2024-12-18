import { Request, Response, NextFunction } from 'express';
import { unauthorizedException } from '../../../utils/apiErrorHandler';
import { getCurrentJST } from '../../../utils/dayjs';
import { getClubByID, getClubDetail, updateClubFields } from '../../../models/club';
import { updateUserFields, updateUserFieldsId } from '../../../models/user';
import { NewClubPromotionDocument } from '../../../models/@types';
import { v4 as uuidv4 } from 'uuid';
import { addClubPromotion, getClubPromotionByID, updateClubPromotionFields } from '../../../models/clubPromotion';
import { handleResponse } from '../../../middleware/requestHandle';

export const getClubProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get clubId in clubAuth
    const { clubId } = req.user;
    // checks whether clubId exists 
    if (!clubId) throw unauthorizedException('Club ID is not defined.');

    // creates club details from club Collection
    const club = await getClubDetail(clubId);

    return res.status(200).json({ success: true, data: { club } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateClubProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in clubAuth
    const { clubId } = req.user;

    // checks whether clubId exists 
    if (!clubId) throw unauthorizedException('Club ID is not defined.');

    // get clubName, imageUrl, website, category and email in body
    const { clubName, imageUrl, website, category, email } = req.body;

    // updates clubFields in club collection
    await updateClubFields(clubId, {
      clubName,
      imageUrl,
      website,
      category,
    });

    // updates user fields in user collection
    await updateUserFieldsId({ clubId }, { email });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateClubPromo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in clubAuth
    const { clubId } = req.user;
    // check whether clubId exists 
    if (!clubId) throw unauthorizedException('Club ID is not defined.');

    //TODO // missing body in swagger.json
    // get title, imageUrls, clubGoal, reasonForSponsorship and returnForSponsorship in body
    const { title, imageUrls, clubGoal, reasonForSponsorship, returnForSponsorship } = req.body;

    // creates new club promotion document
    const newPromo: NewClubPromotionDocument = {
      clubPromotionId: uuidv4(),
      clubId,
      title,
      imageUrls,
      clubGoal,
      reasonForSponsorship,
      returnForSponsorship,
      deletedAt: null,
    };

    // get clubcpromotion with clubId from club promotion collection
    const checkPromo = await getClubPromotionByID(clubId);
    // if clubPromotion not exists, saves a new clubPromo in club promotion collection
    if (!checkPromo) await addClubPromotion(newPromo);
    // if exists , updates with new fields in club promotion collection
    else
      await updateClubPromotionFields(clubId, {
        title,
        clubGoal,
        reasonForSponsorship,
        returnForSponsorship,
        imageUrls,
      });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getPromo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get clubId in clubAuth
    const { clubId } = req.user;
    // checks whether clubId exists 
    if (!clubId) throw unauthorizedException('Club ID is not defined.');

    // get club promotion from clubPromotion collection
    const result = await getClubPromotionByID(clubId);

    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const quitService = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get clubId and userId in clubAuth
    const { clubId, userId } = req.user;
    // checks whether clubId and userId exists 
    if (!clubId) throw unauthorizedException('Club ID is not defined.');
    if (!userId) throw unauthorizedException('User ID is not defined.');

    // updates the clubField with deletedAt field in Club collection
    await updateClubFields(clubId, {
      deletedAt: new Date(getCurrentJST()),
    });

    // update userFields with deletedAt in user collection
    await updateUserFields(userId, {
      deletedAt: new Date(getCurrentJST()),
      refreshToken: null,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
