/**
 * Конкретна реалізація імпортера резюме
 * Наслідується від AbstractImporter і реалізує абстрактні методи
 */

import { AbstractImporter } from "./AbstractImporter";
import { ResumeModel } from "../models/ResumeModel";
import { BlockFactory, BlockType } from "../blocks/BlockFactory";

export class ResumeImporter extends AbstractImporter<ResumeModel> {
  /**
   * Перевіряє, чи відповідає JSON-об'єкт очікуваній структурі
   */
  protected validate(): void {
    const data = this.raw as Partial<ResumeModel> | null | undefined;
    const requiredFields: (keyof ResumeModel)[] = [
      "header",
      "summary",
      "experience",
      "education",
      "skills",
    ];

    const missingField = requiredFields.find((field) => data?.[field] === undefined);
    if (!data || missingField) {
      throw new Error(
        `Неприпустимий формат JSON: відсутнє обов'язкове поле "${missingField}"`,
      );
    }
  }

  /**
   * Перетворює JSON-дані у внутрішню модель резюме
   *
   */
  protected map(): ResumeModel {
    return this.raw as ResumeModel;
  }

  /**
   * Рендерить модель резюме у DOM
   */
  protected render(model: ResumeModel): void {
    const root = document.getElementById("resume-content")!;
    const factory = new BlockFactory();

    const blockTypes: BlockType[] = [
      "header",
      "summary",
      "experience",
      "education",
      "skills",
    ];

    for (const type of blockTypes) {
      root.appendChild(factory.createBlock(type, model).render());
    }
  }
}
