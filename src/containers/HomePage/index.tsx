import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { useInjectSaga } from 'utils/injectSaga'
import { useInjectReducer } from 'utils/injectReducer'

import {
  makeSelectProducts,
  makeSelectError,
  makeSelectLoader
} from './selectors'
import reducer from './reducer'
import saga from './saga'

import { getProducts } from './actions'

import withAuthorization from 'components/Authentication'

import InfoMessage from 'components/Molecules/InfoMessage'
import InlineLoader from 'components/Molecules/InlineLoader'
import Product from './product'

import { Wrapper } from 'styles/styledComponents'

const key = 'products'

const stateSelector = createStructuredSelector({
  products: makeSelectProducts(),
  error: makeSelectError(),
  loading: makeSelectLoader()
})

const HomePage: React.FC = () => {
  const { products, error, loading } = useSelector(stateSelector)
  const dispatch = useDispatch()

  useInjectSaga({ key, saga })
  useInjectReducer({ key, reducer })

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  return (
    <Wrapper>
      {loading && <InlineLoader />}
      {error && <InfoMessage severity="error" message={error.toString()} />}
      {!loading &&
        !error &&
        products &&
        products.map(product => <Product key={product.id} product={product} />)}
    </Wrapper>
  )
}

export default withAuthorization(HomePage)
