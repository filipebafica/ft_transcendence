import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import styles from './style.module.css'

// API
import { getStats, getMatches } from 'api/stats'

// Auth
import { AuthContext } from 'auth'

// Components
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

import MatchHistory from './MatchHistory'

const gameStatuses = ['waiting', 'in progress', 'finished']

const columnsHistoricData = [
  {
    field: 'gameId',
    headerName: 'ID',
    width: 70,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
  },
  {
    field: 'result',
    headerName: 'Result',
    width: 100,
  },
  {
    field: 'opponent',
    headerName: 'Opponent ID',
    width: 100,
  },
  {
    field: 'outcome',
    headerName: 'Outcome',
    width: 80,
  },
]

const parseGamesHistory = (games: any[], userId: string) => {
  const historicData = games.map((game: any) => {
    const { gameId, status, player1Id, player2Id, player1Score, player2Score } = game

    const player1IdString = player1Id.toString()
    const userIdString = userId.toString()
    const isLocal = player1IdString === userIdString

    const opponent = isLocal ? player2Id : player1Id
    const result =
    isLocal
        ? `${player1Score} - ${player2Score}`
        : `${player2Score} - ${player1Score}`
    const statusText = gameStatuses[status]

    const getOutcome = (score1: string, score2: string) => {
      const score1Int = parseInt(score1)
      const score2Int = parseInt(score2)

      if (score1Int > score2Int) {
        return 'W'
      } else if (score1Int < score2Int) {
        return 'L'
      } else {
        return 'T'
      }
    }

    const outcome = isLocal ? getOutcome(player1Score, player2Score) : getOutcome(player2Score, player1Score)

    return {
      gameId: gameId,
      status: statusText,
      result,
      opponent,
      outcome,
    }
  })

  return historicData
}


function StatsPage() {
  const [wins, setWins] = useState(null)
  const [losses, setLosses] = useState(null)
  const [winRate, setWinRate] = useState(null)

  const [numPages, setNumPages] = useState(0)
  const [games, setGames] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)

  const { userId } = useParams()

  let userName = null

  const { user } = useContext(AuthContext)

  const handlePageChange = async (page: number) => {
    if (!userId) return
    setCurrentPage(page)

    const data = await getMatches(userId, page)
    const { games } = data

    const historicData = parseGamesHistory(games, userId)
    setGames(historicData)
  }

  if (userId === user?.id) {
    userName = user?.name
  }

  useEffect(() => {
    if (!userId) return

    const fetchStats = async () => {
      const data = await getStats(userId)
      console.log('data from getStats', data)

      const stats = data.stats
      const { wins, loses, winRate } = stats

      setWins(wins)
      setLosses(loses)
      setWinRate(winRate)
    }
    fetchStats()
  }, [userId])

  useEffect(() => {
    if (!userId) return

    const fetchMatches = async () => {
      const data = await getMatches(userId, currentPage)

      const { numPages, games } = data

      setNumPages(numPages)

      const historicData = parseGamesHistory(games, userId) 
      setGames(historicData)
    }
    fetchMatches()
  }, [userId, currentPage])

  return (
    <div className={styles.statsContainer}>
      <div className={styles.summaryContainer}>
        <Avatar alt={user?.name} sx={{ width: 100, height: 100 }} className={styles.userAvatar} />
        <Typography variant="h6" component="div" className={styles.userName}>
          {userName}
        </Typography>
        <Paper className={styles.stats}>Wins: {wins}</Paper>
        <Paper className={styles.stats}>Losses: {losses}</Paper>
        <Paper className={styles.stats}>Win Rate: {winRate}%</Paper>
      </div>
      <div className={styles.historicContainer}>
        <MatchHistory
          rows={games}
          columns={columnsHistoricData}
          numPages={numPages}
          onPageChange={(page) => {
            handlePageChange(page + 1)
          }}
          currentPage={currentPage - 1}
        />
      </div>
    </div>
  )
}

export default StatsPage
