import 'styled-components';
import theme from './theme';

//Sobrescreve o tipo do tema do styled components

declare module 'styled-components'{
    //Seta o novo tipo através da inferencia de tipo
    type ThemeType = typeof theme

    //Exporta o DeafaultTheme agora recebendo a nova tipagem
    export interface DefaultTheme extends ThemeType{}
}