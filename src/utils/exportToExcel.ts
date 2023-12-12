import * as XLSX from 'xlsx'

export const exportToExcel = (fileName: string, data1: any[], data2?: any[]) => {
  const workbook = XLSX.utils.book_new()

  // Convert the first data array to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data1)

  // Append the first worksheet
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // Set the starting row for the second table
  // For example, if data1 has 10 rows, start from row 12 (leaving one row empty)
  const startingRow = data1.length + 5

  // Add the second data array to the first worksheet, starting at the calculated row
  if (data2 !== undefined) XLSX.utils.sheet_add_json(worksheet, data2, { origin: { r: startingRow, c: 0 } })

  // Write the workbook to a file and trigger download
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
