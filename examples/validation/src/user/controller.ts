import { Body, Controller, Get, Post, QueryParams, Req } from "slowtify";
import { CreateUser } from "./schema";
import { Request } from "express";

@Controller("/users")
export class UserController {
  @Get("/", { permissions: ["test"] })
  async getUserById(@Req() req: Request, @QueryParams() query: CreateUser) {
    return query;
  }

  @Post()
  async createUser(@Body() body: CreateUser) {
    return body;
  }
}
