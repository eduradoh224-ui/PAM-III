import { useContext } from 'react'
import { NavigationContext } from './navigationContext'

export function useNavigation() {
  const navigation = useContext(NavigationContext)
  if (!navigation) throw new Error('useNavigation deve ser usado dentro de StackNavigator')
  return navigation
}