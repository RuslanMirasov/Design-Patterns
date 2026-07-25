/**
 * Блок відображення навичок резюме
 */

import { Skills } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class SkillsBlock implements IBlock {
  constructor(private d: Skills) {}

  /**
   * Рендеринг блоку навичок
   */
  render(): HTMLElement {
    // Створюємо секцію
    const sec = document.createElement("section");
    sec.className = "section skills";
    sec.innerHTML = "<h2>Skills</h2>";

    const list = document.createElement("ul");
    list.className = "skills-list";

    for (const [category, items] of Object.entries(this.d)) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${category}:</strong> ${items.join(", ")}`;
      list.appendChild(li);
    }

    sec.appendChild(list);

    return sec;
  }
}
