import React, {Component} from 'react';
import { GooglePlacesAutoComplete } from 'react-native-google-places-autocomplete'

import { View } from 'react-native';

export default class Search extends Component {
  render () {
    return (
      <GooglePlacesAutoComplete 
        placeholder="Para onde?"
        placeholderTextColor="#333"
        onPress = {() => {}}
        query={{
          key: 'API_KEY',
          language: 'pt'
        }}
        textInputProps={{
          autoCapitalize: "none",
          autoCorrect: false,
        }}
        fetchDetails
        enablePoweredByContainer={false}
      />
    );
  }
}