declare namespace Express {
  export interface Request {
    metadata?: {
      permissions: string[];
    };
  }
}
