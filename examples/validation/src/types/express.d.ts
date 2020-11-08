declare namespace Express {
  export interface Request {
    metadata?: import("slowtify").MethodMetadata;
  }
}
