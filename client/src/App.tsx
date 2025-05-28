import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import IsNotCartEmpty from './outlets/IsNotCartEmpty'
import Layout from './outlets/Layout'
import Cart from './routes/Cart'
import Fallback from './routes/Fallback'
import Home from './routes/Home'
import Product from './routes/Product'
import Products from './routes/Products'

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          <Route element={<IsNotCartEmpty />}>
            <Route path="/cart" element={<Cart />} />
          </Route>

          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<Product />} />

          <Route path="/fallback" element={<Fallback />} />
          <Route path="/*" element={<Navigate to={'/fallback'} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
