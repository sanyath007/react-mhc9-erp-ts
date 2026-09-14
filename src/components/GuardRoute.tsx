import React, { useEffect, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import jwt from "jwt-decode";
import { setLoggedInUser } from '../features/slices/auth/authSlice'
import { useGetUserDetailsQuery } from '../features/services/auth/authApi'
import ChangePassword from '../views/Auth/ChangePassword';
import { RootState, AppDispatch } from '../features/store';

interface GuardRouteProps {
    children: ReactNode;
}

interface JwtPayload {
    exp: number;
    [key: string]: any;
}

const GuardRoute: React.FC<GuardRouteProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoggedIn, loggedInUser } = useSelector((state: RootState) => state.auth);
    const { data: user } = useGetUserDetailsQuery(undefined, {
        pollingInterval: 900000,
        refetchOnMountOrArgChange: true,
    });
    const token = localStorage.getItem("access_token");
    const decode = token ? jwt(token) as JwtPayload : null;

    useEffect(() => {
        if (isLoggedIn && user) {
            console.log('on Guard route loaded...');

            dispatch(setLoggedInUser(user));
        }
    }, [isLoggedIn, user, dispatch]);

    /** Checking token expiration */
    if ((!isLoggedIn && !token) || (decode && ((decode.exp * 1000) < Date.now()))) {
        return <Navigate to="/login" replace={true} />;
    }

    /** If loggedInUser is new user render ChangPassword */
    if (loggedInUser && loggedInUser.is_new === 1) {
        return <ChangePassword currentUser={loggedInUser} />;
    }

    return <>{children}</>;
}

export default GuardRoute