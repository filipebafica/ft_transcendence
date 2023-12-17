import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import styles from './style.module.css'

// Auth
import { AuthContext } from 'auth'

// Components
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper';

import MatchHistory from './MatchHistory'

const gamesSummaryData = {
  wins: 32,
  losses: 12,
}

const columnsHistoricData = [
	{
		field: 'result', headerName: 'Result', width: 70
	},
	{
		field: 'opponent', headerName: 'Opponent', width: 130
	},
	{
		field: 'status', headerName: 'Status', width: 100
	},
	{
		field: 'date', headerName: 'Date', width: 100
	},
]

const gamesHistoricData = [
  {
    result: '2/1',
    opponent: 'John Doe',
    status: 'win',
    date: '2021-10-01',
  },
  {
    result: '2/1',
    opponent: 'John Doe',
    status: 'loss',
    date: '2021-10-01',
  },
  {
    result: '2/1',
    opponent: 'John Doe',
    status: 'win',
    date: '2021-10-01',
  },
  {
    result: '2/1',
    opponent: 'John Doe',
    status: 'loss',
    date: '2021-10-01',
  },
  {
    result: '2/1',
    opponent: 'John Doe',
    status: 'win',
    date: '2021-10-01',
  },
  {
    result: '2/1',
    opponent: 'John Doe',
    status: 'loss',
    date: '2021-10-01',
  },
  {
    result: '2/1',
    opponent: 'John Doe',
    status: 'win',
    date: '2021-10-01',
  },
  {
    result: '2/1',
    opponent: 'John Doe',
    status: 'loss',
    date: '2021-10-01',
  },
]

const theme = createTheme(
	{
	  palette: {
		primary: { main: '#1976d2' },
	  },
	},
  );

function StatsPage() {
  const { wins, losses } = gamesSummaryData
  const winRate = Math.round((wins / (wins + losses)) * 100)

  const { userId } = useParams();
  console.log("userId from params", userId)
  const { user } = useContext(AuthContext)

  return (
    <div className={styles.statsContainer}>
		<div className={styles.summaryContainer}>
			<Avatar alt={user?.name} sx={{ width: 100, height: 100 }} className={styles.userAvatar} />	
			<Typography variant="h6" component="div" className={styles.userName}>
				{user?.name}
			</Typography>
			<Paper className={styles.stats}>
				Wins: {wins}
			</Paper>
			<Paper className={styles.stats}>
				Losses: {losses}
			</Paper>
			<Paper className={styles.stats}>
				Win Rate: {winRate}%
			</Paper>
		</div>
		<div className={styles.historicContainer}>
			<MatchHistory rows={gamesHistoricData} columns={columnsHistoricData} />
		</div>
    </div>
  )
}

export default StatsPage
