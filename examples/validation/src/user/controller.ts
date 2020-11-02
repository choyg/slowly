import { Body, Controller, Get, Post, QueryParams } from "slowtify";
import { CreateUser } from "./schema";

@Controller("/users")
export class UserController {
  @Get()
  async getUserById(@QueryParams() query: CreateUser) {
    return query;
  }

  @Post()
  async createUser(@Body() body: CreateUser) {
    return body;
  }
}
