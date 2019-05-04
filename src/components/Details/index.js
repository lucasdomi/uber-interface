import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Container, TypeTitle, TypeDescription, TypeImage, RequestButton, RequestButtonText} from './styles'
import uberx from '../../../assets/uberx.png'
export default class Details extends Component {
  
  render() {
    return (
      <Container>
        <TypeTitle>Popular</TypeTitle>
        <TypeDescription>Viagens baratas no seu dia</TypeDescription>
        <TypeImage source={uberx}/>

        <TypeTitle>UberX</TypeTitle>
        <TypeDescription>R$ 6,00</TypeDescription>

        <RequestButton onPress={() => {}}>
          <RequestButtonText>Solicitar UberX</RequestButtonText>
        </RequestButton>
      </Container>
    );
  }
}
