
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const axios = require('axios');

const Context = React.createContext();

axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

let AxiosOptions = {
  baseURL: 'http://localhost:5000/api',
  withCredentials: false,
  url: '',
  method: 'get',
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },
}


export class Provider extends Component {

  state = {
    
    authenticatedUser: cookies.get('authenticatedUser') || null,
    redirect: null
  };

  render() {
    const { authenticatedUser } = this.state;
    const value = {
      authenticatedUser,
      redirect: this.state.redirect,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        addNewUser: this.addNewUser,
        finalizeSignIn: this.finalizeSignIn,
        addCourse: this.addNewCourse,
        getAllUserCoursesfor: this.getCourses,
        getUserCourseById: this.getCourseById,
        getCourses: this.getCourses,
        deleteCourseById: this.deleteCourseById,
        updateCourse: this.updateCourse,
        setRedirect: this.setRedirect
      },
    };
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  setRedirect = (redirect) => {
    this.setState(() => {
      return {
        redirect: redirect
      }
    })
  }

  finalizeSignIn = (user) => {
    
      this.setState(() => {
        return {
          authenticatedUser: {firstName:user.first_name, lastName:user.last_name, username: user.username, password:user.password, userId: user.Id }
        };
      });
      const cookieOptions = {
        maxAge: 604800
      };
      
      cookies.set('authenticatedUser', this.state.authenticatedUser, cookieOptions);    
  }
  
  signIn = async (user, finishSubmit, handleError) => {
        
        if (user !== null && typeof(user) !== 'undefined') {
          
          AxiosOptions.auth.username = user.name;
          AxiosOptions.auth.password = user.password;
          AxiosOptions.method = 'get'
          AxiosOptions.url = '/users'

          await axios(AxiosOptions).then(response => {
            if (response.status === 200) {
              finishSubmit(response.data);
            }
          }).catch(error => {
            handleError(error )
          })
            
        }
    }

    addNewUser = async (user, finishSubmit, handleError) => {
      if(user !== null && typeof(user) !== 'undefined') {        

        AxiosOptions.auth = {}
        AxiosOptions.url = '/users';
        AxiosOptions.method = 'post';
        AxiosOptions.data = user;

        await axios(AxiosOptions).then(response => {
          if (response.status === 201) {
            finishSubmit(user)
          }
        }).catch(error => {
          handleError(error)
        })
          
      }
    }

    addNewCourse = async (courseData, finishSubmit, handleError) => {
      
      const user = this.state.authenticatedUser;
      if(user !== null && typeof(user) !== 'undefined') {
        

        AxiosOptions.auth.username = user.username;
        AxiosOptions.auth.password = user.password;
        AxiosOptions.url = '/courses';
        AxiosOptions.method = 'post';
        AxiosOptions.data = courseData;

        await axios(AxiosOptions).then(response => {
          if (response.status === 201) {
            finishSubmit();
          }
        }).catch(error => {
          handleError(error)
        })
          
      }
    }

    updateCourse = async (courseId, courseData, finishSubmit, handleError) => {

      const user = this.state.authenticatedUser;
      if(user !== null && typeof(user) !== 'undefined') {
        
        AxiosOptions.auth.username = user.username;
        AxiosOptions.auth.password = user.password;
        AxiosOptions.url = `/courses/${courseId}`;;
        AxiosOptions.method = 'put';
        AxiosOptions.data = courseData;

        await axios(AxiosOptions).then(response => {
          if (response.status === 200) {
            finishSubmit();
          }
        }).catch(error => {
          handleError(error )
        })
          
      }
    }

    getCourseById = async (courseId, updateCourseDetails, handleError) => {
      
        AxiosOptions.auth = {}
        AxiosOptions.url = `/courses/${courseId}`;
        AxiosOptions.method = 'get';
        AxiosOptions.data = {}

        await axios(AxiosOptions).then(response => {
          if (response.status === 200) {
            updateCourseDetails(response.data);
          }
        }).catch(error => {
          handleError(error )
        })
          
      
    }

    getCourses = async (updateCourselist, handleError) => {
      
        AxiosOptions.auth = {}
        AxiosOptions.url = '/courses';
        AxiosOptions.method = 'get';

        await axios(AxiosOptions).then(response => {
          if (response.status === 200) {
            updateCourselist(response.data);
          }
        }).catch(error => {
            handleError(error );
        })
          
      
    }

    deleteCourseById = async (courseId, finishSubmit, handleError) => {
      
      const user = this.state.authenticatedUser;
      if(user !== null && typeof(user) !== 'undefined') {

        AxiosOptions.auth.username = user.username;
        AxiosOptions.auth.password = user.password;
        AxiosOptions.url = `/courses/${courseId}`;
        AxiosOptions.method = 'delete';
        AxiosOptions.data = {};

        await axios(AxiosOptions).then((response) => {
          if (response.status === 200) {
            finishSubmit();
          }
        }).catch((error) => {
          handleError(error )
          }
        ) 
      }
    }
  

  signOut = () => {
    this.setState({ authenticatedUser: null });
    cookies.remove('authenticatedUser');
    
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

