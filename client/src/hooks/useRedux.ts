import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const useReduxDispatch = () => useDispatch<AppDispatch>()
export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector
