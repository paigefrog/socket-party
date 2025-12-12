import Elysia from "elysia";
import { Resource } from "sst";

// Resource.App.stage;

export const waveLengthController = new Elysia({ prefix: "/wavelength" }).get(
  "/",
  () => "Wavelength Controller"
);
