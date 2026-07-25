/**
 * Патерн Composite (Компоновщик)
 *
 * Блок досвіду роботи, який містить дочірні блоки проєктів
 */

import { Experience } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";
import { ProjectBlock } from "./ProjectBlock";
import { HighlightDecorator } from "../decorators/HighlightDecorator";

export class ExperienceBlock implements IBlock {
  constructor(private d: Experience[]) {}

  /**
   * Рендеринг блоку досвіду роботи
   */
  render(): HTMLElement {
    // Створюємо контейнер для досвіду роботи
    const container = document.createElement("section");
    container.className = "section experience";
    container.innerHTML = "<h2>Experience</h2>";

    for (const job of this.d) {
      const item = document.createElement("div");
      item.className = "experience-item";
      item.innerHTML = `<strong>${job.position}</strong>, ${job.company} (${job.start} – ${job.end})`;

      for (const project of job.projects) {
        let block: IBlock = new ProjectBlock(project);
        if (project.isRecent) {
          block = new HighlightDecorator(block);
        }
        item.appendChild(block.render());
      }

      container.appendChild(item);
    }

    return container;
  }
}
