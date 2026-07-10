import { ReportAdapter } from "./ReportAdapter";
import { DirectoryReport } from "./DirectoryReport";

export class CsvReportAdapter implements ReportAdapter {
  export(report: DirectoryReport): string {
    const lines = [
      "Metric,Value",
      `Total Files,${report.files}`,
      `Total Directories,${report.directories}`,
      `Total Size (bytes),${report.totalSize}`,
      "",
      "Extension,Count",
    ];

    const extensions = Object.entries(report.extensions).sort((a, b) => b[1] - a[1]);

    for (const [ext, count] of extensions) {
      lines.push(`${ext},${count}`);
    }

    return lines.join("\n");
  }
}
