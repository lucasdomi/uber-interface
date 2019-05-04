import React, {Component, Fragment} from 'react';
import { MapView, Location, Permissions } from 'expo';
import { View, Text} from 'react-native';
import Search from '../Search';
// import Directions from '../Directions';
import { getPixelSize } from '../../utils'
import MapViewDirections from '../Directions';
import {LocationBox, LocationText, LocationTimeText, LocationTimeTextSmall, LocationTimeBox} from './styles'
import markerImage from '../../../assets/marker.png'

export default class Map extends Component {
  state = {
    region: null,
    hasLocationPermissions: false,
    locationResult: null,
    destination: null,
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

  handleLocationSelected = (data, {geometry}) => {
    const {location : {lat: latitude, lng: longitude}} = geometry;
    this.setState ({
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text,
      }
    })
    }

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
                ref = {el => this.mapView = el}
              >
                {this.state.destination && (
                  <Fragment>
                    <MapViewDirections 
                      origin={this.state.region}
                      apikey="AIzaSyDJlJg5YjzbBYktHJynrpzBxw0v-xqXjSw"
                      destination={this.state.destination}
                      onReady = {result => {
                        this.mapView.fitToCoordinates(result.coordinates, {
                          edgePadding: {
                            right: getPixelSize(50),
                            left: getPixelSize(50),
                            top: getPixelSize(50), 
                            bottom: getPixelSize(50) 
                          },
                          animated: true
                        });
                      }}
                    />
                    <MapView.Marker
                        coordinate={this.state.destination}
                        anchor= {{x: 0, y: 0}}
                        image={markerImage}>
                      <LocationBox>
                        <LocationText>{this.state.destination.title}</LocationText>
                      </LocationBox>
                    </MapView.Marker>

                    <MapView.Marker
                        coordinate={this.state.region}
                        anchor= {{x: 0, y: 0}}
                      >
                      <LocationBox>
                        <LocationTimeBox>
                          <LocationTimeText>15</LocationTimeText>
                          <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                        </LocationTimeBox>
                        <LocationText>Rua Sao Mauricio</LocationText>
                      </LocationBox>
                    </MapView.Marker>
                  </Fragment>
                )}
              </MapView>
              <Search onLocationSelected ={this.handleLocationSelected}/>
            </View>
        }
      </React.Fragment>
    )
  }
}