import React from 'react';

import { render } from '@testing-library/react-native';

import Profile from '../../screens/Profile';

test('check if show correctly user input name placeholder', () => {
    const { getByPlaceholderText } = render(<Profile />); //Renderizou o componente no teste e separou a funcao de consulta por Placeholder
    
    const inputName = getByPlaceholderText('Nome'); //Realiza a consulta no componente renderizado

    expect(inputName).toBeTruthy(); //Cria a expectativa de que um input com placeholder Nome seja encontrado    
});

test('check if user data has been loaded', () => {
    const { getByTestId } = render(<Profile />);

    const inputName = getByTestId('input-name');
    const inputSurname = getByTestId('input-surname');   

    expect(inputName.props.value).toEqual("Fellipe");
    expect(inputSurname.props.value).toEqual("Neves");
});

test('check if title render correctly', () => {
    const { getByTestId } = render(<Profile />);

    const textTitle = getByTestId('text-title');

    expect(textTitle.props.children).toContain('Perfil');
});