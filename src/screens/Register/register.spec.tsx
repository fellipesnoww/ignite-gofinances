import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { ThemeProvider } from "styled-components/native";
import { Register } from ".";
import theme from "../../global/styles/theme";

const Providers: React.FC = ({children}) => (
    <ThemeProvider theme={theme}>
        { children }
    </ThemeProvider>
);

describe('Register Screen', () => {
    it('should be open category modal when user click on the category button', async () => {
        const { getByTestId } = render(
            <Register/> , 
            {
                wrapper: Providers
            }
        );

        const modalCategory = getByTestId('modal-category');
        const buttonCategory = getByTestId('button-category');

        fireEvent.press(buttonCategory);        

        await waitFor(() => {
            expect(modalCategory.props.visible).toBeTruthy();
        });

    });
})