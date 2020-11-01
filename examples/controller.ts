import { Request, Response } from "express";
import { Body, Req, Res } from "../src/decorators/args";
import { Controller } from "../src/decorators/controller";
import { Get } from "../src/decorators/method";

@Controller("/users")
export class UserController {
  private readonly myval: string;
  constructor() {
    this.myval = "test";
  }
  @Get()
  async getUserById(@Req() req: Request, lol: number, @Body() body: string) {
    const a = new Error("");
    console.error(a.stack);
  }

  @Get(":id")
  async getUserById2(@Res() res: Response, @Req() req: Request, body: string) {
    console.log({
      res,
    });
    return {
      a: this.myval,
    };
  }
}
