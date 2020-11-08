import { MethodMetadata } from "slowtify";

declare module 'slowtify' {
  export interface MethodMetadata {
    permissions: string[];
  }
}
