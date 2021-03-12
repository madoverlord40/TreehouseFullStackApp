
import React, { Component } from 'react';

export default class Courses extends Component {

  htmlInsert = [];

  componentDidMount() {
    this.htmlInsert = [];
    
    const { context } = this.props;

    context.actions.getCourses(this.updateCourses, this.handleError);
    
  }

  updateCourses = (response) => {
    if(response !== null && typeof(response) !=='undefined') {
      response.forEach((element) => {
        const path = `/courses/${element.id}`;
        this.htmlInsert.push(        
              <div className="grid-33"><a className="course--module course--link" href={path} >
                  <h4 className="course--label">Course</h4>
                  <h3 className="course--title">{element.title}</h3>
                </a></div>
          );      
      });
      this.setState({});
    }
  }

  handleError = (error) => {
    if(error.isAxiosError) {
      if(error.response) {
        if(error.response.status === 401) {
          this.props.history.push('/forbidden');
        } else if(error.response.status === 404) {
            this.props.history.push('/notfound');
        } else {
          this.props.errors = [error.response.error]
          this.props.history.push('/error')
        }
      }
      else {
        this.props.errors = [error.response.error]
        this.props.history.push('/error');
      }
    }
    else {
      this.props.errors = [error.response.error]
      this.props.history.push('/error');
    }
  }

  handleCreateCourseClick = (event) => {
    const { context } = this.props;

    if(context.authenticatedUser !== null) {
      this.props.history.push('/courses/create');
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
          {this.htmlInsert}
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
