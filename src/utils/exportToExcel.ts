import * as XLSX from 'xlsx'

interface ExportData {
  generalData: any[]
  pressureData?: any[]
  platingData?: any[]
  stiffenerData?: any[]
}

export const exportToExcel = (fileName: string, data: ExportData) => {
  const workbook = XLSX.utils.book_new()

  // Convert the first data array to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data.generalData)

  // Append the first worksheet
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // Set the starting row for the second table
  // For example, if data1 has 10 rows, start from row 12 (leaving one row empty)
  const startingRow = data.generalData.length + 5
  const startingRow2 = data.generalData.length + 20
  const startingRow3 = data.generalData.length + 30

  // Add the second data array to the first worksheet, starting at the calculated row
  if (data.pressureData !== undefined) XLSX.utils.sheet_add_json(worksheet, data.pressureData, { origin: { r: startingRow, c: 0 } })
  if (data.platingData !== undefined) XLSX.utils.sheet_add_json(worksheet, data.platingData, { origin: { r: startingRow2, c: 0 } })
  if (data.stiffenerData !== undefined) XLSX.utils.sheet_add_json(worksheet, data.stiffenerData, { origin: { r: startingRow3, c: 0 } })

  // Write the workbook to a file and trigger download
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
