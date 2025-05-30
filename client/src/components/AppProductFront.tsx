import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { addProduct, removeProduct } from '@/pizza_slices/Cart'
import { Circle, CircleCheck, Minus, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import config from '../config.json'
import { useReduxDispatch, useReduxSelector } from '../hooks/useRedux.js'
import '../styles/css/ProductFront.css'

const AppProductFront: React.FC<IProductFrontProps> = ({
  id,
  name,
  price,
  currency,
  description,
  details,
  sizes,
  image,
}) => {
  const colors: string[] = Object.keys(sizes)
  const [variant, setVariant] = useState<IVariant | undefined>(undefined)
  const [color, setColor] = useState<string | undefined>(undefined)
  const [colorImage, setColorImage] = useState<string | undefined>(undefined)
  const products = useReduxSelector(state => state.cart.products)
  const dispatch = useReduxDispatch()

  useEffect(() => {
    const key = 0
    if (!colors.length) return

    setColor(colors[key])

    const size = sizes[colors[key]!]!
    setVariant({
      size: size.sizes[key]!,
      image: size.image,
      color: colors[key]!,
    })
  }, [])

  useEffect(() => {
    if (!color) return

    setColorImage(sizes[color]!.image)
  }, [color])

  // useEffect(() => {
  //   console.log(products[id]?.[JSON.stringify(variant)], products, variant)
  // }, [variant])

  return (
    <div className="product__front-subcontainer grid grid-cols-[repeat(2_,1fr)] grid-rows-[max-content] gap-[10px] w-[min(1000px,_100%)]">
      <Card className="overflow-hidden">
        <CardContent>
          <img
            src={colorImage || image}
            alt="CardHeader"
            className="object-cover w-full rounded-xl"
          />
        </CardContent>
      </Card>
      <Card className="gap-[10px]">
        <CardHeader>
          <CardTitle>
            {name} — {price + config.currencyCodes[currency]}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{details}</CardContent>
        <CardFooter className="card__footer flex flex-col gap-[10px]">
          {color && (
            <div className="grid grid-cols-[repeat(2,_1fr)] grid-rows-[max-content] gap-[5px] w-full">
              {colors.map((val, i) => {
                return (
                  <Button
                    key={i}
                    className="flex justify-between items-center"
                    variant={'outline'}
                    onClick={() => {
                      if (color === val) {
                        return
                      }

                      setColor(val)
                    }}
                  >
                    <span>{val}</span>
                    {color !== val ? <Circle /> : <CircleCheck />}
                  </Button>
                )
              })}
            </div>
          )}
          {color && variant && (
            <div className="flex flex-col gap-[5px] w-full">
              {sizes[color]!.sizes.map((val, i) => {
                return (
                  <Button
                    key={i}
                    className="flex justify-between items-center"
                    variant={'ghost'}
                    onClick={() => {
                      if (variant.size === val && variant.color === color) {
                        return
                      }

                      // order matters!
                      setVariant({
                        size: val,
                        image: sizes[color]!.image,
                        color: color,
                      })
                    }}
                  >
                    <span>{val}</span>
                    {variant.size !== val || variant.color !== color ? (
                      <Circle />
                    ) : (
                      <CircleCheck />
                    )}
                  </Button>
                )
              })}
            </div>
          )}
          <div className="flex gap-[5px] w-full">
            {products[id]?.[JSON.stringify(variant)] && (
              <Button
                size={'icon'}
                onClick={() => {
                  const totalQuantity =
                    (products[id]?.[JSON.stringify(variant)]?.quantity || 1) - 1
                  dispatch(
                    removeProduct({
                      id: id,
                      variant: variant,
                    })
                  )

                  toast(
                    `'${name} • ${variant!.color} • ${variant!.size}' has been removed from your cart`,
                    {
                      description: totalQuantity > 0 && (
                        <span className="text-muted-foreground">
                          Total: {totalQuantity}
                        </span>
                      ),
                    }
                  )
                }}
              >
                <Minus />
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={() => {
                const totalQuantity =
                  (products[id]?.[JSON.stringify(variant)]?.quantity || 0) + 1
                dispatch(
                  addProduct({
                    id: id,
                    name: name,
                    price: price,
                    currency: currency,
                    description: description,
                    image: image,
                    variant: variant,
                    quantity: 1,
                  })
                )

                toast(
                  `'${name} • ${variant!.color} • ${variant!.size}' has been added to your cart`,
                  {
                    description: totalQuantity > 0 && (
                      <span className="text-muted-foreground">
                        Total: {totalQuantity}
                      </span>
                    ),
                  }
                )
              }}
            >
              Add it
              <Plus />
            </Button>
          </div>
          <Link className="text-muted hover:underline" to={'/cart'}>
            Go to cart
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AppProductFront
