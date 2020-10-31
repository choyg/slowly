import Ajv from "ajv";
import express from "express";
import { resolve } from "path";
import pino from "pino-http";
import * as TJS from "typescript-json-schema";
import { loadRoutes } from "../src";
import { ControllerMethods, Controllers } from "../src/decorators/state";
import { Logger } from "../src/logger/logger";
import { UserController } from "./controller";
import { UserController as a } from "./controller2";

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const router = express.Router();
  const app = express();

  const generator = compileSchemas();

  app.use(pino());
  app.use(router);

  loadRoutes({
    controllers: [UserController, a],
    router,
  });

  app.listen(port, () => {
    Logger.info(`Listening on port ${port}`);
  });
}

console.log(Controllers);
console.log(ControllerMethods);

let ajv: Ajv;

function compileSchemas() {
  Logger.trace("Compiling JSON schemas");

  const options: TJS.PartialArgs = {
    required: true,
    strictNullChecks: true,
    defaultNumberType: "integer",
    uniqueNames: true,
  };

  const files: string[] = [
    resolve(__dirname, "testing.ts"),
    resolve(__dirname, "testing2.ts"),
  ];
  const program = TJS.getProgramFromFiles(files, null);

  const generator = TJS.buildGenerator(program, options);
  if (!generator) {
    throw new Error("Failed to generate");
  }

  const symbols = generator.getMainFileSymbols(program);
  const schemas = generator.getSchemaForSymbols(symbols).definitions;
  Logger.info(schemas!);
  if (!schemas) {
    throw new Error("Failed to retrieve generated schemas");
  }

  ajv = new Ajv({
    schemas,
  });

  Logger.trace("Finished compiling JSON schemas");
  return generator;
}

bootstrap();
