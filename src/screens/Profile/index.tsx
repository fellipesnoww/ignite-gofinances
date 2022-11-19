import React from 'react'
import { View, Text, TextInput, Button } from 'react-native'

export default function Profile() {
  return (
    <View>
      <Text testID='text-title'>
        Perfil
      </Text>
      <TextInput
        testID='input-name' 
        placeholder='Nome'
        autoCorrect={false}
        value="Fellipe"
      />
      <TextInput 
        testID='input-surname'
        placeholder='Sobrenome'
        autoCorrect={false}
        value="Neves"
      />

      <Button 
        testID='button-submit'
        title='Salvar'
        onPress={() => {}}
      />
    </View>
  )
}