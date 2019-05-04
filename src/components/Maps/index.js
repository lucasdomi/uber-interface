import React, {Component, Fragment} from 'react';
import { MapView, Location, Permissions } from 'expo';
import { View, Text, Image} from 'react-native';
import Search from '../Search';
import { getPixelSize } from '../../utils'
import MapViewDirections from '../Directions';
import {LocationBox, LocationText, LocationTimeText, LocationTimeTextSmall, LocationTimeBox, Back} from './styles'
import markerImage from '../../../assets/marker.png'
import Geocoder from 'react-native-geocoding'
import backImage from '../../../assets/back.png'
import Details from '../Details';


Geocoder.init('AIzaSyDJlJg5YjzbBYktHJynrpzBxw0v-xqXjSw')

export default class Map extends Component {
  state = {
    region: null,
    hasLocationPermissions: false,
    locationResult: null,
    destination: null,
    duration: null,
    myLocation: null,
  };

  componentDidMount () {
    this._getLocationAsync();
  }

  _handleMapRegionChange = region => {
      this.setState({ region});
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
    const response = await Geocoder.from (location.coords.latitude, location.coords.longitude);
    const address = response.results[0].formatted_address;
    const myLocation = address.substring(0, address.indexOf(','));
    this.setState({ locationResult: JSON.stringify(location) });

    // Center the map on the location we just fetched.
    
      console.log("entrou")
      this.setState({
        myLocation, 
        region: { 
          latitude: location.coords.latitude, 
          longitude: location.coords.longitude, 
          latitudeDelta: 0.0922, 
          longitudeDelta: 0.0421,
        }
      });
    

     
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

  handleBack = () => {
    this.setState({
      destination: null,
    })
  }

  render () {
    const {region, destination} = this.state;
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
                region={region}
                onRegionChangeEnd={this._handleMapRegionChange}
                showsUserLocation
                loadingEnabled
                ref = {el => this.mapView = el}
              >
                {this.state.destination && (
                  <Fragment>
                    <MapViewDirections 
                      origin={region}
                      apikey="AIzaSyDJlJg5YjzbBYktHJynrpzBxw0v-xqXjSw"
                      destination={destination}
                      onReady = {result => {
                        this.setState({duration: Math.floor(result.duration)})
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
                      coordinate={destination}
                      anchor= {{x: 0, y: 0}}
                      image={markerImage}
                    >
                      <LocationBox>
                        <LocationText>{destination.title}</LocationText>
                      </LocationBox>
                    </MapView.Marker>

                    <MapView.Marker
                      coordinate={region}
                      anchor= {{x: 0, y: 0}}
                    >
                      <LocationBox>
                        <LocationTimeBox>
                          <LocationTimeText>{this.state.duration}</LocationTimeText>
                          <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                        </LocationTimeBox>
                        <LocationText>{this.state.myLocation}</LocationText>
                      </LocationBox>
                    </MapView.Marker>
                  </Fragment>
                )}
              </MapView>

              {this.state.destination ? (
                <Fragment>
                  <Back onPress={this.handleBack}>
                    <Image source ={backImage} />
                  </Back>
                  <Details />
                </Fragment>
                
              ) : (
              <Search onLocationSelected ={this.handleLocationSelected}/>
              )}
              
            </View>
        }
      </React.Fragment>
    )
  }
}