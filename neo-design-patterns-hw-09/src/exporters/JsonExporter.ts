import { DataExporter } from "./DataExporter";

export class JsonExporter extends DataExporter {
  protected render(): string {
    return JSON.stringify(this.data, null, 2);
  }

  protected save(): void {
    this.saveToFile("users.json");
  }
}
