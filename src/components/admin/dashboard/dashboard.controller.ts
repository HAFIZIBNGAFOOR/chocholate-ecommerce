import { Request, Response, NextFunction } from 'express';
import { getGraphData, getTotalCmpAndClub } from '../../../models/dashboard';
import { handleResponse } from '../../../middleware/requestHandle';
import * as service from './dashboard.service';
import { PeriodType } from '../../../models/@types';


export const getTotalCmyAndClubs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get total company count and club count from clubs and company collection
    const result = await getTotalCmpAndClub();
    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getGraphTotalRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get startDate and endDate in query
    const { startDate, endDate } = req.query;

    // check whether startDate and endDate exists 
    if (!startDate || !endDate) throw new Error('1031');

    // get graph data from users collection
    const result = await getGraphData(startDate.toString(), endDate.toString());

    return handleResponse(res, 200, { result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
