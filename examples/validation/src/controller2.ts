import { Request } from "express";
import { Controller, Get, Req } from "slowtify";

@Controller("/")
export class UserController {
  @Get()
  async thisisdifferent(@Req() req: Request, body: string) {
    console.log("wow");
  }

  @Get("/wowanoth/thing/a")
  ok(@Req() req: Request, body: string) {
    console.log("wow");
  }
}
