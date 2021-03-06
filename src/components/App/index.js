import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from '@material-ui/core';

import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import MatchPage from '../Match';
import MatchCreatePage from '../MatchCreate';
import HeaderAndDrawer from '../HeaderAndDrawer';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div>
      <HeaderAndDrawer />
      <Container maxWidth="xl">
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.MATCH} component={MatchPage} />
        <Route path={ROUTES.MATCH_CREATE} component={MatchCreatePage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
      </Container>
    </div>
  </Router>
);

export default withAuthentication(App);