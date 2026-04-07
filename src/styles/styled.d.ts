import 'styled-components';
import { night } from './Theme';

type ThemeType = typeof night;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
