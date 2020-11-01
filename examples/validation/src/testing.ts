export interface TestSchema {
  sizes: number[];
  /**
   * @minLength 1
   */
  optional?: string;
}

export interface LMAO extends TestSchema {
  yo: number;
}
