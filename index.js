import { enableLatestRenderer } from 'react-native-maps'
import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import App from './App'

enableLatestRenderer()

AppRegistry.registerComponent(appName, () => App)
