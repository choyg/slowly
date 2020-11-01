import Ajv from "ajv";
import express from "express";
import { resolve } from "path";
import pino from "pino-http";
import Slowtify from "slowtify";
import * as TJS from "typescript-json-schema";
import { UserController } from "./controller";
import { UserController as a } from "./controller2";

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const router = express.Router();
  const app = express();

  const generator = compileSchemas();

  app.use(express.json());
  app.use(pino());
  app.use(router);

  const slow = new Slowtify({
    controllers: [UserController, a],
  });
  slow.useExpress(router);

  app.listen(port, () => {
    console.info(`Listening on port ${port}`);
  });
}

let ajv: Ajv;

function compileSchemas() {
  console.info("Compiling JSON schemas");

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
  console.info(schemas!);
  if (!schemas) {
    throw new Error("Failed to retrieve generated schemas");
  }

  ajv = new Ajv({
    schemas,
  });

  console.info("Finished compiling JSON schemas");
  return generator;
}

bootstrap();
