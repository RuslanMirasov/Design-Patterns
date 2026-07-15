import { DocNode } from "../interfaces/DocNode";
import { DocRenderer } from "../interfaces/DocRenderer";

export class Section implements DocNode {
  constructor(
    private title: string,
    private renderer: DocRenderer,
    private children: DocNode[] = [],
    private level: number = 1,
  ) {}

  add(child: DocNode): void {
    this.children.push(child);
  }

  render(): string {
    const header = this.renderer.renderHeader(this.level, this.title);
    const content = this.children.map((child) => child.render());

    return [header, ...content].join("\n\n");
  }
}
