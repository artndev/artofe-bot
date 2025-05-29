import type { ResultSetHeader } from 'mysql2'
import pool from '../pool.js'

export default {
  Login: async (id: string) => {
    try {
      const [rows] = await pool.query<IUser[]>(
        'SELECT * FROM Users WHERE Id = ?;',
        [id]
      )

      if (rows.length === 0) {
        await pool.query<ResultSetHeader>(
          'INSERT INTO Users (Id) VALUES (?);',
          [id]
        )
      }

      const [rows2] = await pool.query<IUser[]>(
        'SELECT * FROM Users WHERE Id = ?;',
        [id]
      )

      return {
        message: 'You have successfully authorized',
        answer: rows2[0],
      }
    } catch (err) {
      console.log(err)

      throw new Error('Server is not responding')
    }
  },
}
