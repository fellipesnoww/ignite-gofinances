import React from 'react';
import { render } from '@testing-library/react-native';
import { Input } from '.';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../../global/styles/theme';

//Cria um componente separado para agrupar os providers sendo a prop children o proprio componente do teste
//já que na configuração esse componente sera utilizado com um wrapper
const Providers: React.FC = ({children}) => (
    <ThemeProvider theme={theme}>
        { children }
    </ThemeProvider>
);

describe('Input Component', () => {
    it('must have specific border config when active', () => {
        const { getByTestId } = render(
            <Input 
                testID='input-email'
                placeholder='Email'
                keyboardType='email-address'
                autoCorrect={false}
                active={true}
            />,
            {
                wrapper: Providers
            }
        );

        const inputComponent = getByTestId('input-email');

        expect(inputComponent.props.style[0].borderColor)
        .toEqual(theme.colors.attention);
        
        expect(inputComponent.props.style[0].borderWidth)
        .toEqual(3);
    })

});