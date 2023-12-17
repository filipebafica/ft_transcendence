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
}

const MatchHistory = (props: MatchHistoryProps) => {
  const { rows, columns } = props

  return (
	<>
	<TableContainer className={styles.tableContainer}>
		<Table>
			<TableHead className={styles.tableHeader}>
				<TableCell>Result</TableCell>
				<TableCell>Opponent</TableCell>
				<TableCell>Status</TableCell>
				<TableCell>Date</TableCell>
			</TableHead>
			<TableBody>
				{rows.map((row) => (
					<TableRow key={row.name}>
						<TableCell>{row.result}</TableCell>
						<TableCell>{row.opponent}</TableCell>
						<TableCell>{row.status}</TableCell>
						<TableCell>{row.date}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>
	<TablePagination
		component="div"
		count={-1}
		rowsPerPageOptions={[]}
		rowsPerPage={10}
		page={0}
		onPageChange={() => {}}
		onRowsPerPageChange={() => {}}
	/>
	</>
  )
}

export default MatchHistory
