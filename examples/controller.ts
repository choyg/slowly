import { Body, Params, QueryParams } from "../src/decorators/args";
import { Controller } from "../src/decorators/controller";
import { Get, Post } from "../src/decorators/method";
import { TestSchema } from "./testing2";

@Controller("/users")
export class UserController {
  private readonly myval: string;
  constructor() {
    this.myval = "test";
  }
  @Get()
  async getUserById(@Body() body: string) {
    throw new Error("ok");
  }

  @Get(":id")
  async getUserById2(@QueryParams() query: any, @Params() params: TestSchema) {
    return {
      a: this.myval,
      params,
      query,
    };
  }

  @Post()
  async createUser(@QueryParams() query: any, @Body() body: any, test: string) {
    return {
      body,
      query,
    };
  }
}
