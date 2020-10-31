import { Request } from "express";
import { Req } from "../src/decorators/args";
import { Controller } from "../src/decorators/controller";
import { Get } from "../src/decorators/method";

@Controller("/users")
export class UserController {
  @Get()
  async getUserById(@Req() req: Request, body: string) {
    console.log("wow");
  }
}
