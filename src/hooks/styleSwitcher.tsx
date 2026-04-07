import React, { createContext, useCallback, useState, useContext, ReactNode, useEffect } from 'react'
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
    isHydrated: boolean;
}

const StyleSwitcherContext = createContext<StyleSwitcherContextData>({} as StyleSwitcherContextData);

const StyleSwitcherProvider: React.FC<StyleSwitcherProps> = ({ children }) => {
    const [data, setData] = useState<StyleData>(() => {
        return { alias: 'dark' };
    });

    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        if (isServer()) return;

        const theme = localStorage.getItem('@DevFinder:theme') || 'dark';
        setData({ alias: theme });
        setIsHydrated(true);
    }, []);

    const switchAlias = useCallback(() => {
        if (isServer()) return;

        const alias = data.alias === 'dark' ? 'light' : 'dark';
        
        setData({
            alias,
        });

        localStorage.setItem('@DevFinder:theme', alias);
    }, [setData, data.alias])

    return (
        <StyleSwitcherContext.Provider value={{ alias: data.alias, switchAlias, isHydrated }}>
            {children}
        </StyleSwitcherContext.Provider>
    )
};

function useStyleSwitcher() {
    const context = useContext<StyleSwitcherContextData>(StyleSwitcherContext);

    return context;
}

export { StyleSwitcherProvider, useStyleSwitcher }
