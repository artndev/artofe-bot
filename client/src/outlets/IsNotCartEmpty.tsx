import { Navigate, Outlet } from 'react-router-dom'
import { useReduxSelector } from '../hooks/useRedux'

const IsNotCartEmpty = () => {
  const products = useReduxSelector(state => state.cart.products)

  return (
    <>
      {Object.keys(products).length > 0 ? (
        <Outlet />
      ) : (
        <Navigate to="/products" />
      )}
    </>
  )
}

export default IsNotCartEmpty
