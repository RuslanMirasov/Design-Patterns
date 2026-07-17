import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { UserData } from "../data/UserData";

export abstract class DataExporter {
  protected data: UserData[] = [];
  protected result: string = "";

  public async export(): Promise<void> {
    await this.load();
    this.transform();
    this.beforeRender();
    this.result = this.render();
    this.afterRender();
    this.save();
  }

  protected async load(): Promise<void> {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    this.data = (await response.json()) as UserData[];
  }

  protected transform(): void {
    this.data = this.data
      .map(({ id, name, email, phone }) => ({ id, name, email, phone }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  protected beforeRender(): void {
    // hook
  }

  protected afterRender(): void {
    // hook
  }

  protected abstract render(): string;
  protected abstract save(): void;

  protected saveToFile(fileName: string): void {
    const distDir = join(process.cwd(), "dist");
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }
    writeFileSync(join(distDir, fileName), this.result);
  }
}
