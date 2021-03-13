
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const axios = require('axios');

const Context = React.createContext();
//default axios headers for posting with CORS..
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

//default Axios options to pass into axios so we can setup authentication
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

//CLASS: Provider of Component
//Acts as the higher order component that holds gloval state in context
//Allows us to grant access to some data and functions throughout the app.
export class Provider extends Component {

    //stateful component
    state = {
      //use cookies to keep track of the authenticated user
      authenticatedUser: cookies.get('authenticatedUser') || null,
      redirect: null
    };

    //the render function override
    //sets up the actions and data to be globally available throught the app as a Context
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

    //updates the redirect variable, which is used when we click create course button when not authenticated
    //we want to be able to redirect to signin, then redirect back to create course with authenticated user.
    setRedirect = (redirect) => {
      this.setState(() => {
        return {
          redirect: redirect
        }
      })
    }

    //once the signin is authenticated, we update the state and cookies
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
    
    //Function for signing in
    //@Param user: the user information to sign in with
    //@Param finishSubmit: Callback to the caller component, so we can notify it when the promise signin has completed
    //@Param handleError: Callback to the caller component to handle any errors that occur when talking to the rest api.
    //ASYNC: waits for axios to finish talking to the rest api
    signIn = async (user, finishSubmit, handleError) => {
          
          if (user !== null && typeof(user) !== 'undefined') {
            
            AxiosOptions.auth.username = user.emailAddress;
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

    //Function for adding a new user
    //@Param user: the user information create
    //@Param finishSubmit: Callback to the caller component, so we can notify it when the promise has completed
    //@Param handleError: Callback to the caller component to handle any errors that occur when talking to the rest api.
    //ASYNC: waits for axios to finish talking to the rest api
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

    //Function for adding a new course
    //@Param courseData: the course data to create a new course with
    //@Param finishSubmit: Callback to the caller component, so we can notify it when the promise has completed
    //@Param handleError: Callback to the caller component to handle any errors that occur when talking to the rest api.
    //ASYNC: waits for axios to finish talking to the rest api
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

    //Function for updating an existing course
    //@Param courseId: the id of the course to update, passed down from props.match.id
    //@Param courseData: the course data to create a new course with
    //@Param finishSubmit: Callback to the caller component, so we can notify it when the promise has completed
    //@Param handleError: Callback to the caller component to handle any errors that occur when talking to the rest api.
    //ASYNC: waits for axios to finish talking to the rest api
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

    //Function for fetching course data by its id.
    //@Param courseId: the course id look up
    //@Param updateCourseDetails: Callback to the caller component, so we can notify it when the promise has completed, and pass the resulting data
    //@Param handleError: Callback to the caller component to handle any errors that occur when talking to the rest api.
    //ASYNC: waits for axios to finish talking to the rest api
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

    //Function to fetch all courses in the database
    //@Param updateCourseList: Callback to the caller component, so we can notify it when the promise has completed and return the fetched data
    //@Param handleError: Callback to the caller component to handle any errors that occur when talking to the rest api.
    //ASYNC: waits for axios to finish talking to the rest api
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

    //Function for deleting an existing course
    //@Param courseId: the id of the course to update, passed down from props.match.id
    //@Param finishSubmit: Callback to the caller component, so we can notify it when the promise has completed
    //@Param handleError: Callback to the caller component to handle any errors that occur when talking to the rest api.
    //ASYNC: waits for axios to finish talking to the rest api
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
    

    //Function for signing out
    //simply updates the higher order context state, setting the auth user to null
    //and removes the cookie containing the auth information
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

