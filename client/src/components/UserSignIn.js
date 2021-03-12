
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';


export default class UserSignIn extends Component {
  state = {
    username: '',
    password: '',
    isAuthenticated: false,
    errors: [],
  }

  componentWillMount() {
    if(this.state.isAuthenticated) {
      this.props.history.push('/index');
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

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  handleError = (error) => {
    if(error.isAxiosError) {
      if(error.response) {
        if(error.response.status === 401) {
          this.setState(() => {
            return { errors: [ 'Invalid username or password.' ], username:'' , password: '', isAuthenticated: false };
          });
        } else {
          this.setState(() => {
            return { errors: error.response.data.errors, username:'' , password: '', isAuthenticated: false };
          });
        }
      }
      else {
        this.props.history.push('/error');
      }
    }
    else {
      this.props.history.push('/error');
    }
  }

  finishSubmit = (response) => {
    
    const { username, password } = this.state;
    const { context } = this.props;    
      
    this.setState(() => {
      return { errors: [ ], username:username , password: password, isAuthenticated: true};
    });

    context.actions.finalizeSignIn({...response, password: password });
    if(this.props.context.redirect !== null) {
      this.props.history.push(this.props.context.redirect)
      context.actions.setRedirect(null);
    } else {
      this.props.history.goBack();    
    }
      
  }

  submit = async ()=> {
    const { context } = this.props;
    const { username, password } = this.state;

    let errors = []

    if(username === null || typeof(username) == 'undefined' || username === '') {
      errors.push('*Username cannot be blank')
    }
    if(password === null || typeof(password) == 'undefined' || password === '') {
      errors.push('*Password cannot be blank')
    }

    if(errors.length === 0) {
      context.actions.signIn({name: username, password: password}, this.finishSubmit, this.handleError);
    } else {
      this.setState(() => {
        return { errors: errors, username:'' , password: '', isAuthenticated: false};
      });
    }
    
  } 

  cancel = () => {
    this.props.history.push('/');
  }
}
