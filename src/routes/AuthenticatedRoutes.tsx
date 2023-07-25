import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './constants';
import { Home } from '../views/home/Home';
import { CreateLeague } from '../views/league/createLeague/CreateLeague';
import { LeagueDetails } from '../views/league/details/LeagueDetails';
import { AdminHome } from '../views/admin/AdminHome';
import { AddConcertResults } from '../views/admin/AddConcertResults';

export const AuthenticatedRoutes = [
  {
    path: ROUTES.home,
    element: <Home />,
  },
  {
    path: ROUTES.createLeague,
    element: <CreateLeague />,
  },
  {
    path: ROUTES.admin.root + '/*',
    element: (
      <Routes>
        <Route path='/:id/*' element={<AddConcertResults />} />
        <Route path='/' element={<AdminHome />} />
        <Route path='*' element={<AdminHome />} />
      </Routes>
    ),
  },
  {
    path: ROUTES.league.root + '/*',
    element: (
      <Routes>
        <Route path='/:id/*' element={<LeagueDetails />} />
        <Route path='/' element={<Navigate to={ROUTES.home} />} />
        <Route path='*' element={<Navigate to={ROUTES.home} />} />
      </Routes>
    ),
  },
];
