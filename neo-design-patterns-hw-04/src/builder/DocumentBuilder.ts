export class DocumentBuilder {
  private header?: string;
  private body?: string;
  private footer?: string;

  addHeader(header: string): this {
    this.header = header;
    return this;
  }

  addBody(body: string): this {
    this.body = body;
    return this;
  }

  addFooter(footer: string): this {
    this.footer = footer;
    return this;
  }

  build(): string {
    const parts: string[] = [];

    if (this.header) parts.push(`=== ${this.header} ===`);
    if (this.body) parts.push(this.body);
    if (this.footer) parts.push(this.footer);

    return parts.join("\n\n");
  }
}
