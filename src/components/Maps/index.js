import React, {Component} from 'react';
import { MapView, Location, Permissions, Constants } from 'expo';
import {View, Text} from 'react-native';

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
    console.log(region);
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
    console.log("my region", this.state.region);
    return (

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ecf0f1'}} >
        {this.state.locationResult === null ? 
            <Text>Finding your current location...</Text> :
          this.state.hasLocationPermissions === false ?
            <Text>Location permissions are not granted.</Text> :
          this.state.region === null ?
            <Text>Map region doesn exits</Text> :
            <MapView
              style={{ flex: 1 }}
              region={this.state.region}
              onRegionChange={this._handleMapRegionChange}
              showsUserLocation
              loadingEnabled
            />
        }
      </View>
    )
  }
}