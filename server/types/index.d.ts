export {}
import { JwtPayload } from 'jsonwebtoken'
import { ResultSetHeader } from 'mysql2'
import 'express'

declare global {
  namespace Express {
    interface Request {
      id?: string
    }
  }

  export interface IProduct extends ResultSetHeader {
    Id: number
    Name: string
    Price: number
    Currency: string
    Description: string
    Image: string
    Details: string
    Sizes: string
    Updated: string
  }

  export interface IProductCheckout {
    currency: ICurrency
    description: string
    id: number
    image: string
    name: string
    price: number
    quantity: number
    totalProductPrice: number
    totalProductPriceCoded: string
    variant: {
      color: string
      size: string
      image: string
    }
  }

  export interface IUser extends ResultSetHeader {
    Id: string
    DiscountLevel: number
    Created: string
  }

  export interface IJwtPayload extends JwtPayload {
    jti: string
    userId: string
    referenceId: string
    lineItems: string
    totalPrice: string
  }

  export interface ICheck extends ResultSetHeader {
    ReferenceId: string
    LineItems: string
    TotalPrice: string
    UserId: string
  }

  export interface ILineItem {
    price_data: {
      currency: ICurrency
      product_data: {
        name: string
        images: string[]
        metadata: {
          id: number
        }
      }
      unit_amount: number
    }
    quantity: number
  }
}
