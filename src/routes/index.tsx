import * as React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import { useAuthentication } from '../services/useAuthentication';
import { AuthenticatedRoutes } from './AuthenticatedRoutes';
import { Login } from '../views/authentication/Login';
import { ROUTES } from './constants';
import { AccountSetup } from '../views/accountSetup/AccountSetup';
import { NavigationBar } from '../components/desktopNavigation/NavigationBar';
import { usePublicData } from '../services/usePublicData';
import { useEffect } from 'react';
import { ConcertsHome } from '../views/concerts/ConcertsHome';
import { OutfitsHome } from '../views/outfits/OutfitsHome';
import { SurpriseSongsHome } from '../views/surpriseSongs/SurpriseSongsHome';
import { useWindowSize } from '@uidotdev/usehooks';
import { MobileNavigation } from '../components/mobileNavigation/MobileNavigation';
import { PrivacyPolicy } from '../views/about/PrivacyPolicy';
import { TermsOfUse } from '../views/about/TermsOfUse';
import { AboutUs } from '../views/about/AboutUs';
import { SupportUs } from '../views/about/SupportUs';
import { HowToPlay } from '../views/about/HowToPlay';
import { Leaderboard } from '../views/Leaderboard/Leaderboard';
import { useNavigate } from 'react-router-dom';
import { useQueryParams } from '../utils/useQueryParams';
import { Litigation } from '../views/about/Litigation';

export const AppRoutes = () => {
  const navigate = useNavigate();
  const { queryParams } = useQueryParams();
  const { isAuthenticated, isAccountSetupCompleted } = useAuthentication();
  const { initialize } = usePublicData();
  const { width } = useWindowSize();

  const { route } = queryParams;

  useEffect(() => {
    initialize();
    // connect backend routing and frontend routing
    // only handles unauthenticated routes here. Authenticated ones handled in Home
    if (route === ROUTES.outfits || route === ROUTES.concerts || route === ROUTES.surpriseSongs || route === ROUTES.leaderboard) {
      navigate(route);
    }
  }, []);

  const commonRoutes: RouteObject[] = [
    {
      path: ROUTES.concerts,
      element: <ConcertsHome />,
    },
    {
      path: ROUTES.outfits,
      element: <OutfitsHome />,
    },
    {
      path: ROUTES.surpriseSongs,
      element: <SurpriseSongsHome />,
    },
    {
      path: ROUTES.leaderboard,
      element: <Leaderboard />,
    },
    {
      path: ROUTES.privacyPolicy,
      element: <PrivacyPolicy />,
    },
    {
      path: ROUTES.termsOfUse,
      element: <TermsOfUse />,
    },
    {
      path: ROUTES.about,
      element: <AboutUs />,
    },
    {
      path: ROUTES.supportUs,
      element: <SupportUs />,
    },
    {
      path: ROUTES.howToPlay,
      element: <HowToPlay />,
    },
    {
      path: ROUTES.litigation,
      element: <Litigation />,
    },
  ];

  let routes;

  if (!isAuthenticated) {
    routes = [
      {
        path: ROUTES.home,
        element: <Login />,
      },
    ];
  } else if (!isAccountSetupCompleted) {
    routes = [
      {
        path: ROUTES.home,
        element: <AccountSetup />,
      },
    ];
  } else {
    routes = AuthenticatedRoutes;
  }
  const element = useRoutes([...routes, ...commonRoutes]);

  return (
    <>
      {width >= 576 ? <NavigationBar /> : <MobileNavigation />}
      {element}
    </>
  );
};
