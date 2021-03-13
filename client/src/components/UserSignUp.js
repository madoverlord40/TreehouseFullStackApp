import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';
const axios = require('axios');

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export default class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text"
                  value={firstName} 
                  onChange={this.change} onBlur={this.change}
                  placeholder="First Name" />
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text"
                  value={lastName} 
                  onChange={this.change} onBlur={this.change}
                  placeholder="Last Name" />
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text"
                  value={emailAddress} 
                  onChange={this.change} onBlur={this.change}
                  placeholder="Email Address" />
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} onBlur={this.change}
                  placeholder="Password" />
              </React.Fragment>
            )} />
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
          </p>
        </div>
      </div>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  finishSubmit = (user) => {
    
    if(user !== null && typeof(user) !== 'undefined') {
      const { context } = this.props;
      context.actions.signIn(user, this.finalizeSignUp, this.handleError);
      
    }
  }

  finalizeSignUp = (user) => {
    if(user !== null && typeof(user) !== 'undefined') {
      const { context } = this.props;
      context.actions.finalizeSignIn(user);
      this.props.history.push('/'); 
    }
  }

  handleError = (error) => {
    if(error.isAxiosError) {
      if(typeof (error.response) != 'undefined') {
        if(error.response.status === 400) {
          this.setState( {errors: error.response.data.errors} );
        } else {
          this.setState( {errors: [error.response.data.message]});
          this.props.history.push('/error');
        }
      }
    }
  }

  submit = async () => {
      const { context } = this.props;
      const {
        firstName,
        lastName,
        emailAddress,
        password,
      } = this.state;

      // Create user
      const user = {
        firstName,
        lastName,
        emailAddress,
        password,
      };
      
      context.actions.addNewUser(user, this.finishSubmit, this.handleError);
      
    }


  cancel = () => {
   this.props.history.push('/');
  }
}
