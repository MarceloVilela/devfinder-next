import React, { createContext, useCallback, useState, useContext, ReactNode } from 'react'
import { isServer } from '../utils';

interface StyleSwitcherProps {
    children: ReactNode;
}

interface StyleData {
    alias: string;
}

interface StyleSwitcherContextData {
    alias: String;
    switchAlias(alias: string): void;
}

const StyleSwitcherContext = createContext<StyleSwitcherContextData>({} as StyleSwitcherContextData);

const StyleSwitcherProvider: React.FC<StyleSwitcherProps> = ({ children }) => {
    const [data, setData] = useState<StyleData>(() => {
        if (isServer) {
            return { alias: 'dark' };
        }

        const theme = localStorage.getItem('@DevFinder:theme');

        if (theme) {
            return { alias: theme };
        }

        return { alias: 'dark' };
    });

    const switchAlias = useCallback(() => {
        if (isServer) return;

        const alias = data.alias === 'dark' ? 'light' : 'dark';
        console.log(`switchAlias: ${alias}`);

        setData({
            alias,
        });

        localStorage.setItem('@DevFinder:theme', alias);
    }, [setData, data.alias])

    return (
        <StyleSwitcherContext.Provider value={{ alias: data.alias, switchAlias }}>
            {children}
        </StyleSwitcherContext.Provider>
    )
};

function useStyleSwitcher() {
    const context = useContext<StyleSwitcherContextData>(StyleSwitcherContext);

    return context;
}

export { StyleSwitcherProvider, useStyleSwitcher }
