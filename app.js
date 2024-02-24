const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()

app.use(express.json())

let db = null

const dbpath = path.join(__dirname, 'cricketTeam.db')
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

//Get all Players API
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
        SELECT
        *
        FROM cricket_team
        ORDER BY player_id`
  const playersList = await db.all(getPlayersQuery)
  response.send(playersList)
})

//Post a new player API
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addPlayerQuery = `
        INSERT INTO
            cricket_team (playe_name, jersey_number, role)
        VALUES
            (
                "${playerName}",
                ${jerseyNumber},
                "${role}"
            );`
  const dbResponse = await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

//Get player based on player ID API
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
        SELECT
            *
        FROM cricket_team
        WHERE
            player_id = ${playerID};`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

//Update the player details using Put API
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `
        UPDATE
            cricket_team
        SET
            player_name = "${playerName}",
            jersey_number = ${jerseyNumber},
            role = "${role}"
        WHERE
            player_id = ${playerId};`
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

//Delete player API
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
