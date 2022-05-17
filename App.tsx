import { SafeAreaView, StyleSheet, View, Dimensions, PermissionsAndroid, Button } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import MapView, { Marker } from 'react-native-maps'
import React, { useEffect, useState } from 'react'

const { height } = Dimensions.get('window')

export default function App() {
  const [locationActive, setLocationActive] = useState<boolean>(false)
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  useEffect(() => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then((check) => {
        if (check) {
          setLocationActive(true)
        } else {
          requestLocationPermission()
        }
      })
      .catch((error) => console.log(error))
  }, [])

  const handleClick = () => {
    if (locationActive) {
      Geolocation.getCurrentPosition(
        (position) => {
          setRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0,
          })
        },
        (error) => {
          console.log(error.code, error.message)
        },
        { enableHighAccuracy: true, timeout: 1000, maximumAge: 1000 }
      )
    }
  }

  const handleSuscribe = () => {
    if (locationActive) {
      const id = Geolocation.watchPosition(
        (position) => {
          setRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0,
          })
        },
        (error) => {
          console.log(error.code, error.message)
        },
        { enableHighAccuracy: true, distanceFilter: 0, interval: 100, fastestInterval: 100 }
      )

      console.log(id)
    }
  }

  const unsuscribe = () => {
    Geolocation.clearWatch(0)
    Geolocation.stopObserving()
  }

  return (
    <SafeAreaView>
      <Button title="Ir a mi ubicacion" onPress={handleClick} />
      <Button title="Suscribirme" onPress={handleSuscribe} />
      <Button title="Desuscribirme" onPress={unsuscribe} />
      <View style={styles.container}>
        <MapView style={styles.map} region={region}>
          <Marker coordinate={region} title="test marker" description="test description" />
        </MapView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: height,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'Permiso para utilizar el gps',
      message: 'Utilizar gps',
      buttonNegative: 'Cancelar',
      buttonPositive: 'OK',
    })

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //console.log('You can use the location')
    } else {
      console.log('Gps permission denied')
    }
  } catch (err) {
    console.warn(err)
  }
}
