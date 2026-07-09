import { DocumentBuilder } from "./DocumentBuilder";

const builder = new DocumentBuilder();

const output = builder
  .addHeader("ACME Corporation — Report")
  .addBody("Quarterly performance increased by 12%.")
  .addFooter("--- Confidential ---")
  .build();

console.log(output);
