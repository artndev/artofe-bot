import { Request, Response } from 'express'
import type { ResultSetHeader } from 'mysql2'
import pool from '../pool.js'

export default {
  Delete: async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query<ResultSetHeader>(
        'DELETE FROM ProductsArtofe WHERE Id = ?;',
        [req.params.id]
      )

      if (!rows.affectedRows) {
        res.status(404).json({
          message: 'Entry with this id cannot be found',
          answer: null,
        })
        return
      }

      res.status(200).json({
        message: 'You have successfully deleted entry with this id',
        answer: true,
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        message: 'Server is not responding',
        answer: null,
      })
    }
  },
  Create: async (req: Request, res: Response) => {
    try {
      await pool.query<ResultSetHeader>(
        'INSERT INTO ProductsArtofe (Name, Price, Currency) VALUES (?, ?, ?);',
        [req.body.name, req.body.price, req.body.currency]
      )

      res.status(200).json({
        message: 'You have successfully created entry',
        answer: true,
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        message: 'Server is not responding',
        answer: null,
      })
    }
  },
  Update: async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query<ResultSetHeader>(
        `
          UPDATE ProductsArtofe SET 
            Name = ?, 
            Price = ?,
            Currency = ?, 
            Updated = CURRENT_TIMESTAMP() 
          WHERE Id = ?;
        `,
        [req.body.name, req.body.price, req.body.currency, req.params.id]
      )

      if (!rows.affectedRows) {
        res.status(404).json({
          message: 'Entry with this id cannot be found',
          answer: null,
        })
        return
      }

      res.status(200).json({
        message: 'You have successfully updated entry with this id',
        answer: true,
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        message: 'Server is not responding',
        answer: null,
      })
    }
  },
  GetAll: async (_req: Request, res: Response) => {
    try {
      const [rows] = await pool.query<IProduct[]>(
        'SELECT * FROM ProductsArtofe'
      )

      res.status(200).json({
        message: 'You have successfully got all entries',
        answer: rows,
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        message: 'Server is not responding',
        answer: null,
      })
    }
  },
  Get: async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query<IProduct[]>(
        'SELECT * FROM ProductsArtofe WHERE Id = ?;',
        [req.params.id]
      )

      if (!rows.length) {
        res.status(404).json({
          message: 'Entry with this id cannot be found',
          answer: null,
        })
        return
      }

      res.status(200).json({
        message: 'You have successfully got entry with this id',
        answer: rows[0],
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        message: 'Server is not responding',
        answer: null,
      })
    }
  },
}
