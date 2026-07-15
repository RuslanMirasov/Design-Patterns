import { RenderEventSubscriber } from "../interfaces/RenderEventSubscriber";
import { RenderContext } from "../interfaces/RenderContext";

export class PerformanceSubscriber implements RenderEventSubscriber {
  private totalRenderTime = 0;

  update(context: RenderContext): void {
    this.totalRenderTime += context.renderTime ?? 0;
  }

  printTotal(): void {
    console.log(`[Performance] Total render time: ${this.totalRenderTime}ms`);
  }
}
