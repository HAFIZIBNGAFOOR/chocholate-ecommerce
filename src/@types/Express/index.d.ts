declare namespace Express {
  interface Request {
    user: {
      userId?: string;
      userType?: 'companyAdmin' | 'clubAdmin' | 'clubMember';
      companyId?: string | null;
      clubId?: string | null;
      clubMemberId?: string | null;
    };
    admin: {
      adminId?: string;
      email?: string;
      adminType?: 'superAdmin' | 'general';
    };
    token: any;
  }
}
