/**
 * Download a single-sheet Excel-compatible template with no exceljs/xlsx deps.
 * Uses SpreadsheetML (.xls) — opens in Excel/Google Sheets; users can Save As .xlsx for import.
 */
function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function downloadExcelTemplate({ sheetName, fileName, headers }) {
  const safeSheet = escapeXml(sheetName || "Sheet1").slice(0, 31);
  const cells = headers
    .map(
      (header) =>
        `<Cell><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`,
    )
    .join("");

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="${safeSheet}">
  <Table>
   <Row>${cells}</Row>
  </Table>
 </Worksheet>
</Workbook>`;

  // SpreadsheetML is an .xls format Excel understands
  const downloadName = String(fileName || "template.xls").replace(
    /\.xlsx$/i,
    ".xls",
  );
  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = downloadName;
  link.click();
  URL.revokeObjectURL(url);
}
