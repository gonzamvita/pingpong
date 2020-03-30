import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import * as ROUTES from '../../constants/routes';

class SignOut extends Component {
  onClick = () => {
    this.props.firebase.doSignOut();
    this.props.history.push(ROUTES.LANDING);
  }
  render() {
    return (
      <ExitToAppRoundedIcon onClick={this.onClick}/>
    );
  }
}

const SignOutButton = compose(withRouter, withFirebase)(SignOut);

export default withFirebase(SignOutButton);