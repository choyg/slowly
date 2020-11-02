# Slowtify

TypeScript decorators for Express.

## Install

`npm install slowtify`

## Usage

```typescript
/* index.ts */
import Slowtify from "slowtify";
import express from "express";

const app = express();
app.use(express.json());
app.use(router);

const slow = new Slowtify({
  controllers: [UserController],
});
slow.useExpress(router);

app.listen(port, () => {
  console.info(`Listening on port ${port}`);
});
```

```typescript
/* UserController.ts */
@Controller("/users")
export class UserController {
  @Get(":id")
  async getUserById(@Params() params: UserParams) {
    return params.id;
  }

  @Post()
  async createUser(@Req() req: Request, @Body() body: CreateUser) {
    console.log(req.headers);
    return {
      body,
    };
  }
}
```

See the [full example](./examples/validation) that adds input validation.

# License

[MIT](./LICENSE)
