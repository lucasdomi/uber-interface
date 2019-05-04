import React, {Component} from 'react';
import { MapView, Location, Permissions } from 'expo';
import { View, Text} from 'react-native';
import Search from '../Search';

export default class Map extends Component {
  state = {
    region: null,
    hasLocationPermissions: false,
    locationResult: null
  };

  componentDidMount () {
    this._getLocationAsync();
  }

  _handleMapRegionChange = region => {
    this.setState({ region });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }
 
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });
    
    // Center the map on the location we just fetched.
     this.setState({region: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
   };

  render () {
    return (
      <React.Fragment>
        { this.state.locationResult === null ?
          <View style={{flex: 1,
            alignItems: 'center',
            justifyContent: 'center'}}>
          <Text>Finding your current location...</Text>
          </View> :
          this.state.hasLocationPermissions === false ?
            <View style={{flex: 1,
              alignItems: 'center',
              justifyContent: 'center',}}>
              <Text>Location permissions are not granted.</Text>
            </View> :
            this.state.mapRegion === null ?
            <View>
              <Text>Map region doesn't exist.</Text>
            </View> :
            <View style={{flex: 1}} >
              <MapView
                style={{ flex: 1 }}
                region={this.state.region}
                onRegionChange={this._handleMapRegionChange}
                showsUserLocation
                loadingEnabled
              />
              <Search />
            </View>
        }
      </React.Fragment>
    )
  }
}