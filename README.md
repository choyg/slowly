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

## Metadata

Slowtify allows adding metadata to the route via the decorator. For example, `@Get('/', { permissions: ['test'] })` sets the permission for that route and will be accessible in the request object of the handler and middleware registered with Slowtify.

## Middleware

Express middleware can be added outside of Slowtify with the standard `app.use` syntax. To register middleware via Slowtify, `slowtify.use` adds the middleware function(s) to each route and appends route metadata to the request object.

Middleware execution order follows Express' syntax and will always be executed before the route handler.

Example:

```ts
slowtify.use((req, res, next) => {
  console.log(req.metadata);
  next();
});
```

# License

[MIT](./LICENSE)
