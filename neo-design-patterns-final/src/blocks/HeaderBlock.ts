/**
 * Блок відображення заголовка резюме
 */

import { ResumeModel } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class HeaderBlock implements IBlock {
  constructor(private d: ResumeModel["header"]) {}

  /**
   * Рендеринг блоку заголовка
   */
  render(): HTMLElement {
    // Створюємо контейнер для заголовка
    const header = document.createElement("header");
    header.className = "section header";

    const { fullName, title, contacts } = this.d;
    const contactLine = [contacts.email, contacts.phone, contacts.location]
      .filter(Boolean)
      .join(" | ");

    header.innerHTML = `
      <h1>${fullName}</h1>
      <p>${title}</p>
      <p>${contactLine}</p>
    `;

    return header;
  }
}
