import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import { PasswordForgetLink } from '../PasswordForget';
import * as ROUTES from '../../constants/routes';
import { TextField, Button} from '@material-ui/core';

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <PasswordForgetLink />    
    <SignUpLink />
  </div>
);
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };
  render() {
    const { email, password, error } = this.state;
    const isInvalid = (password === '' || email === '');

    return (
      <div>
        <TextField
          required
          id="email"
          label="Email Address"
          variant="filled"
          value={this.state.email}
          onChange={this.onChange}
        />
        <TextField
          required
          id="password"
          label="Password"
          type="password"
          autoComplete={this.state.password}
          variant="outlined"
          value={this.state.password}
          onChange={this.onChange}
        />

        <Button type="submit" disabled={isInvalid} 
          variant="contained" onClick={ e=> this.onSubmit(e)}>
          Sign In
        </Button>
        {error && <p>{error.message}</p>}
      </div>  
    );
  }
}
const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);
export default SignInPage;
export { SignInForm };