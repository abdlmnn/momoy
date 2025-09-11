import { Image, Text, View } from 'react-native';
import React from 'react';

export default function BenefitRow({ ...props }: any) {
  return (
    <View style={props.BenefitRow}>
      <Image
        source={props.Images}
        style={props.ImageLogo}
        resizeMode="contain"
      />

      <Text style={props.StyleText}>{props.Text}</Text>
    </View>
  );
}
