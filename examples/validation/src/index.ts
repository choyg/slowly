import Ajv from "ajv";
import addFormats from "ajv-formats";
import express, { Request } from "express";
import { resolve } from "path";
import pino from "pino-http";
import Slowtify from "slowtify";
import * as TJS from "typescript-json-schema";
import { UserController } from "./user/controller";
import { JsonSchemaValidator } from "./validator";

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const router = express.Router();
  const app = express();

  app.use(express.json());
  app.use(pino());
  app.use(router);

  const ajv = compileSchemas();

  const slow = new Slowtify({
    controllers: [UserController],
    validator: new JsonSchemaValidator(ajv),
  });
  slow.use((req: Request, res, next) => {
    if (req.metadata?.permissions) {
      console.log("Metadata: " + JSON.stringify(req.metadata));
    }
    next();
  });
  slow.useExpress(router);

  app.listen(port, () => {
    console.info(`Listening on port ${port}`);
  });
}

function compileSchemas() {
  console.info("Compiling JSON schemas");

  const options: TJS.PartialArgs = {
    required: true,
    strictNullChecks: true,
    defaultNumberType: "integer",
  };

  const files: string[] = [resolve(__dirname, "user/schema.ts")];
  const program = TJS.getProgramFromFiles(files, null);

  const generator = TJS.buildGenerator(program, options);
  if (!generator) {
    throw new Error("Failed to generate");
  }

  const symbols = generator.getMainFileSymbols(program);
  const schemas = generator.getSchemaForSymbols(symbols).definitions;
  if (!schemas) {
    throw new Error("Failed to retrieve generated schemas");
  }

  const ajv = new Ajv({
    schemas,
    removeAdditional: "all",
    validateSchema: true,
    validateFormats: true,
    coerceTypes: "array",
  });
  addFormats(ajv);

  console.info("Finished compiling JSON schemas");
  return ajv;
}

bootstrap();
