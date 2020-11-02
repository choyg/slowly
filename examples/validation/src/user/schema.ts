export class CreateUser {
  /**
   * @minLength 1
   */
  name!: string;

  /**
   * @format email
   */
  email!: string;

  fingers?: number;

  toes?: number[];
}
