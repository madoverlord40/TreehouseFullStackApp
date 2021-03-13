
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

//Component class UserSignIn
//Handles rendering the user sign in page
export default class UserSignIn extends Component {
  state = {
    username: '',
    password: '',
    isAuthenticated: false,
    errors: [],
  }

  //if we are done showing the page and we are authenticated, redirect to the default route
  componentWillMount() {
    if(this.state.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  render() {
    const {
      username,
      password,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            className="pad-bottom"
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <input 
                  id="username" 
                  name="username" 
                  type="text"
                  value={username} 
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
            Don't have a user account? <Link to="/signup">Click here</Link> to sign up!
          </p>
        </div>
      </div>
    );
  }

  //Function for updating the state values from the form
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  //function to handle errors, passed down to the context when making api calls
  //@Param error: the error information returned from Axios
  handleError = (error) => {
    //if this is an axios error, then check the status of the error and handle
    if(error.isAxiosError) {
      //sometimes the response has no information so lets make sure its valid
      if(typeof(error.response) !== 'undefined') {
        //401 means invalid login info
        if(error.response.status === 401) {
          this.setState(() => {
            return { errors: [ 'Invalid username or password.' ], username:'' , password: '', isAuthenticated: false };
          });
          //if not an auth error but in the 400 domain, show the error
        } else if (error.response.status >= 400 && error.response.status < 500) {
          this.setState(() => {
            return { errors: error.response.data.errors, username:'' , password: '', isAuthenticated: false };
          });
        }
      }
      //for any other error push the error page, might be 500
      else {
        this.props.history.push('/error');
      }
    }
    //for any other error push the error page, might be 500
    else {
      this.props.history.push('/error');
    }
  }

  //function to handle the post submit, after axios calls to the api
  //passed down to the context and called when axios completes successfully
  finishSubmit = (response) => {
    
    const { username, password } = this.state;
    const { context } = this.props;    
      
    this.setState(() => {
      return { errors: [ ], username:username , password: password, isAuthenticated: true};
    });

    //update the context so we store the login globally
    context.actions.finalizeSignIn({...response, password: password });

    //if we have a redirect, then use it after the signin, otherwise, go back to last page when auth is completed
    if(this.props.context.redirect !== null) {
      this.props.history.push(this.props.context.redirect)
      context.actions.setRedirect(null);
    } else {
      this.props.history.goBack();    
    }
      
  }

  //function to handle form submit
  submit = async ()=> {
    const { context } = this.props;
    const { username, password } = this.state;

    let errors = []

    //make sure the username and password fields are not blank
    if(username === null || typeof(username) == 'undefined' || username === '') {
      errors.push('*Username cannot be blank')
    }
    if(password === null || typeof(password) == 'undefined' || password === '') {
      errors.push('*Password cannot be blank')
    }

    if(errors.length === 0) {
      context.actions.signIn({emailAddress: username, password: password}, this.finishSubmit, this.handleError);
    } else {
      this.setState(() => {
        return { errors: errors, username:'' , password: '', isAuthenticated: false};
      });
    }
    
  } 

  //cancel form button, redirect to default route.
  cancel = () => {
    this.props.history.push('/');
  }
}
