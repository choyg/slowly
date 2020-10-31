import { Request } from "express";
import { Req } from "../src/decorators/args";
import { Controller } from "../src/decorators/controller";
import { Get } from "../src/decorators/method";

@Controller("/lmao")
export class UserController {
  @Get()
  async thisisdifferent(@Req() req: Request, body: string) {
    console.log("wow");
  }

  @Get()
  async ok(@Req() req: Request, body: string) {
    console.log("wow");
  }
}
