import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useTelegram } from '@/hooks/useTelegram.js'
import {
  addProduct,
  getProducts,
  getTotalPrice,
  removeProduct,
} from '@/pizza_slices/Cart'
import { loadStripe } from '@stripe/stripe-js'
import { CreditCard, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import axios from '../axios.js'
import { useReduxDispatch, useReduxSelector } from '../hooks/useRedux.js'
import '../styles/css/Cart.css'
import { Button } from './ui/button'

const AppCart = () => {
  const { user } = useTelegram()
  const totalPrice = useReduxSelector(getTotalPrice)
  const products = useReduxSelector(getProducts)
  const dispatch = useReduxDispatch()

  const makePayment = async () => {
    try {
      const stripe = await loadStripe(
        process.env.VITE_STRIPE_PUBLISHABLE_KEY!,
        {
          stripeAccount: process.env.VITE_STRIPE_ACCOUNT_ID,
        }
      )

      if (!stripe) {
        console.log('Stripe is not loaded')
        return
      }

      alert(user.id.toString())
      const res = await axios.post('/api/orders/checkout', {
        userId: user.id.toString(),
        products: products,
        totalPrice: totalPrice,
      })

      const checkout = await stripe.redirectToCheckout({
        sessionId: res.data.answer.id,
      })

      if (checkout.error) alert(checkout.error.message)
    } catch (err) {
      alert(JSON.stringify(err))

      console.log(err)
    }
  }

  return (
    <div className="cart__subcontainer grid grid-cols-[repeat(2_,1fr)] grid-rows-[max-content] gap-[10px] w-[min(1000px,_100%)]">
      <div className="flex flex-col gap-[10px] max-h-[500px] overflow-y-auto">
        {products.map((product, i) => {
          return (
            <Card
              key={i}
              className="grid grid-cols-[repeat(2,_1fr)] grid-rows-[max-content] gap-[5px]"
            >
              <div className="flex flex-col gap-[10px]">
                <CardHeader className="pr-[0px]">
                  <div className="overflow-hidden">
                    <img
                      src={product.variant.image}
                      alt="CardHeader"
                      className="object-cover w-full rounded-xl"
                    />
                  </div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {product.totalProductPriceCoded}{' '}
                  {product.quantity > 1 && `(x${product.quantity})`}
                </CardContent>
              </div>
              <div>
                <CardFooter className="flex flex-col items-start gap-[5px] pl-[0px]">
                  <span className="text-muted mb-[10px]">
                    {product.variant.color} • {product.variant.size}
                  </span>
                  <Button
                    className="flex justify-between items-center w-full"
                    onClick={() => {
                      const totalQuantity = product.quantity + 1

                      dispatch(addProduct(product))

                      toast(
                        `'${product.name} • ${product.variant.color} • ${product.variant.size}' has been added to your cart`,
                        {
                          description: (
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
                  <Button
                    className="flex justify-between items-center w-full"
                    onClick={() => {
                      const totalQuantity = product.quantity - 1

                      dispatch(
                        removeProduct({
                          id: product.id,
                          variant: product.variant,
                        })
                      )

                      toast(
                        `'${product.name} • ${product.variant.color} • ${product.variant.size}' has been removed from your cart`,
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
                    Remove it
                    <Minus />
                  </Button>
                </CardFooter>
              </div>
            </Card>
          )
        })}
      </div>
      <Card className="cart__checkout gap-[10px]">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Make the payment</CardDescription>
        </CardHeader>
        <CardContent>~{totalPrice}</CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => makePayment()}>
            <CreditCard />
            Pay by card
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AppCart
