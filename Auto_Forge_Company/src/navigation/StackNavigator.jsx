import { useMemo, useState } from 'react'
import { NavigationContext } from './navigationContext'
import { routes, stackScreens } from './routes'

export function StackNavigator({ children, initialRouteName = routes.COMPOSER }) {
  const [screen, setScreen] = useState(initialRouteName)
  const navigate = (nextScreen) => {
    if (stackScreens.includes(nextScreen)) setScreen(nextScreen)
  }
  const navigation = useMemo(() => ({
    screen,
    navigate,
  }), [screen])

  return <NavigationContext.Provider value={navigation}>{children}</NavigationContext.Provider>
}
