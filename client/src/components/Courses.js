
import React, { Component } from 'react';

//Default route Courses Component, shows a list of courses
export default class Courses extends Component {

  htmlInsert = [];

  //when we mount lets get the available courses from the rest api and populate the DOM
  componentDidMount() {
    const { context } = this.props;
    //fetch the courses and report back with values or error handling
    context.actions.getCourses(this.updateCourses, this.handleError);
    
  }

  //callback function for fetching courses, passing in the response from axios
  updateCourses = (response) => {
    this.htmlInsert = [];
    //make sure the response is valid
    if(response !== null && typeof(response) !=='undefined') {
      //loop the response which should contain a list from the database
      response.forEach((element, index) => {
        const path = `/courses/${element.id}`;
        this.htmlInsert.push(        
              <div key={index} className="grid-33"><a className="course--module course--link" href={path} >
                  <h4 className="course--label">Course</h4>
                  <h3 className="course--title">{element.title}</h3>
                </a></div>
          );
      });
      this.setState({});
    }
  }

  //callback for fetching courses with axios, handles any errors axios reports
  handleError = (error) => {
    if(error.isAxiosError) {
      if(typeof(error.response) !== 'undefined') {
        //if axios failed to get the data from the rest api
        if(error.response.status !== 200) {          
          this.props.history.push('/error')
        }
      }
      //anything else is a server error
      else {
        this.props.history.push('/error');
      }
    }
    //anything else is a server error
    else {
      this.props.history.push('/error');
    }
  }

  //function for button click create course
  handleCreateCourseClick = (event) => {
    const { context } = this.props;
    //if we are authenticated go to create course
    if(context.authenticatedUser !== null) {
      this.props.history.push('/courses/create');
      //if not authenticated, set the redirect location in the context state
      //Then send to the signin page. The signin page will check for the redirect so it can take
      //you to the create course page on successful signin, instead of the default route.
    } else {
      context.actions.setRedirect('/courses/create');
      this.props.history.push('/signin');
    }
  }

  render() {
    return (
      
      <div id="root">
        <hr />
        <div className="bounds">
          {
            /* render dynamic DOM 
              this is a list of dynamically created course buttons populated when mounted.
            */
            this.htmlInsert
          }
          <div className="grid-33"><a className="course--module course--add--module" onClick={this.handleCreateCourseClick}>
                <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                    <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 " />
                  </svg>New Course</h3>
              </a></div>
        </div>
      </div>        
    );
  }
}
