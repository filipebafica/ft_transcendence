import React from 'react'

import styles from './style.module.css'

// Components
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { TablePagination } from '@mui/material'

interface MatchHistoryProps {
  rows: any[]
  columns: any[]
  numPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

const MatchHistory = (props: MatchHistoryProps) => {
  const { rows, columns, onPageChange, numPages, currentPage } = props

  const handlePageChange = (event: any, page: number) => {
    console.log('page changed', page)
    onPageChange(page)
  }

  return (
    <>
      <TableContainer className={styles.tableContainer}>
        <Table>
          <TableHead className={styles.tableHeader}>
            {columns.map((column: any) => (
              <TableCell key={column.field}>{column.headerName}</TableCell>
            ))}
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                {columns.map((column: any) => (
                  <TableCell key={column.field}>{row[column.field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={currentPage === numPages - 1 ? (currentPage * 10) + rows.length : numPages * 10}
        rowsPerPageOptions={[]}
        rowsPerPage={10}
        page={currentPage}
        onPageChange={handlePageChange}
        slotProps={{
          actions: {
            nextButton: {
              style: { display: currentPage >= numPages - 1 ? 'none' : "" },
            },
          },
        }}
      />
    </>
  )
}

export default MatchHistory
