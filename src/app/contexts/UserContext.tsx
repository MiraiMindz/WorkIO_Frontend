import { ReactElement, ReactNode, createContext, useContext, useState, Dispatch, useEffect } from "react";

type UserContextType = {
    token: string;
    // setToken: Dispatch<React.SetStateAction<string>>;
    setToken: (value: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({children}: { children: ReactNode }): ReactElement<any, any> {
    const [token, setTokenState] = useState<string>("");

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setTokenState(storedToken);
        }
    }, []);

    const setToken = (value: string): void => {
        console.log("CHANGING TOKEN TO: ", value);
        setTokenState(value);
        localStorage.setItem('token', value);
        console.log(token);
    }
    
    return (
        <UserContext.Provider value={{token, setToken}}>
            { children }
        </UserContext.Provider>
    )

}

export function useUserContext(): UserContextType {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }

    return context;
}