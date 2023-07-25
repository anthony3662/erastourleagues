import * as React from 'react';
import { createContext } from '../utils/createContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AUTHENTICATED_BASE, ENDPOINTS } from '../constants/endpoints';
import { User } from '../models/user';

type AuthenticationContext = {
  validateSession: () => Promise<boolean>;
  login(jwt: string): Promise<void>;
  postAccountSetup(accountInfo: { username: string; avatar: string }): Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAccountSetupCompleted: boolean;
  user: User | null; // only authentication related field will be kept up to date
  setUser: React.Dispatch<User | null>;
};

const [useAuthentication, AuthenticationProvider, authenticationContext] = createContext<AuthenticationContext>(() => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const validateSession: () => Promise<boolean> = useCallback(async () => {
    const body = await fetch(ENDPOINTS.validateSession, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include the cookie in the request
    })
      .then(res => res.json())
      .catch(e => {
        console.error(e);
      });
    if (body.success) {
      setIsAuthenticated(true);
    }
    if (body.user) {
      setUser(body.user);
    }
    return body.success;
  }, []);

  const postGoogleJWT = useCallback(async (jwt: string) => {
    await fetch(ENDPOINTS.googleSignIn, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include the cookie in the request
      body: JSON.stringify({
        idToken: jwt,
      }),
    })
      .then(res => {
        if (res.status == 403) {
          throw Error('403');
        }
        return res.json();
      })
      .then(json => {
        setIsAuthenticated(true);
        if (json.user) {
          setUser(json.user);
        }
      })
      .catch(console.error);
  }, []);

  // catch me outside
  const postAccountSetup = useCallback(async ({ username, avatar }: { username: string; avatar: string }) => {
    await fetch(ENDPOINTS.accountSetup, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include', // Include the cookie in the request
      },
      credentials: 'include', // Include the cookie in the request
      body: JSON.stringify({ username, avatar }),
    })
      .then(async res => {
        if (res.status === 403) {
          await logout();
          throw Error('log out due to 403');
        }
        return res.json();
      })
      .then(json => {
        if (json.user) {
          setUser(json.user);
        } else {
          throw Error(json.message);
        }
      });
  }, []);

  const logout = useCallback(async () => {
    await fetch(ENDPOINTS.logout, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include the cookie in the request
    }).catch(console.error);
    setUser(null);
    setIsAuthenticated(false);
    window.location.replace(process.env.REACT_APP_ENV === 'prod' ? 'https://erastourleagues.com/' : 'http://localhost:3000');
  }, []);
  return useMemo(
    () => ({
      validateSession,
      login: postGoogleJWT,
      logout,
      postAccountSetup,
      isAuthenticated,
      isAccountSetupCompleted: Boolean(user),
      user,
      setUser,
    }),
    [validateSession, postGoogleJWT, logout, postAccountSetup, isAuthenticated, user],
  );
});

export { useAuthentication, AuthenticationProvider, authenticationContext };
export type { AuthenticationContext };
