
import React, { Component, } from 'react';
import Form from './Form';

export default class CreateCourse extends Component {
  
  state = {
    courseTitle: '',
    courseDescription: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: []
  }

  finishSubmit = () => {
    
    this.setState(() => 
    {
      return { 
            courseTitle: '',
            courseDescription: '',
            estimatedTime: '',
            materialsNeeded: '',
            errors: []
          };
    });

    this.props.history.push('/courses');

  }

  handleError = (error) => {
    if(error.isAxiosError) {
      if(error.response) {
        if(error.response.status >= 400) {
          this.setState(() => {
            return { errors: [ ...error.response.data.errors ] };
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

  handleSubmit = async (event) => {

    const { context } = this.props; 
   
    let data = {
      "title": this.state.courseTitle,
      "description": this.state.courseDescription,
      "estimatedTime": this.state.estimatedTime,
      "materialsNeeded": this.state.materialsNeeded
    }

    context.actions.addCourse(data, this.finishSubmit, this.handleError);    
  }
  

  handleCancleClick = (event) => {
    this.props.history.push('/courses');
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

  render() {
    let user = 'default';
    if(this.props.context.authenticatedUser) {
      user = this.props.context.authenticatedUser.firstName + ' ' + this.props.context.authenticatedUser.lastName;
    }

    const {
      courseTitle,
      courseDescription,
      estimatedTime,
      materialsNeeded,
      errors
    } = this.state;
    
    return (
          <div>
          <div id="root">
            <div>
              <hr />
              <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
                <Form
                    cancel={this.handleCancleClick}
                    errors={this.state.errors}
                    submit={this.handleSubmit}
                    className="grid-100 pad-bottom"
                    submitButtonText='Create Course'
                    elements={() => (
                      <React.Fragment>                  
                          <div className="grid-66">
                            <div className="course--header">
                              <h4 className="course--label">Course</h4>
                              <div><input id="title" name="courseTitle" type="text" className="input-title course--title--input" placeholder="Course title..." defaultValue={courseTitle} onChange={this.change} onBlur={this.change} /></div>
                              <p>By {user}</p>
                            </div>
                            <div className="course--description">
                              <div><textarea id="description" name="courseDescription" placeholder="Course description..." defaultValue={courseDescription} onChange={this.change} onBlur={this.change} /></div>
                            </div>
                          </div>
                          <div className="grid-25 grid-right">
                            <div className="course--stats">
                              <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                  <h4>Estimated Time</h4>
                                  <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" defaultValue={estimatedTime} onChange={this.change} onBlur={this.change}/></div>
                                </li>
                                <li className="course--stats--list--item">
                                  <h4>Materials Needed</h4>
                                  <div><textarea id="materialsNeeded" name="materialsNeeded" placeholder="List materials..." defaultValue={materialsNeeded} onChange={this.change} onBlur={this.change}/></div>
                                </li>
                              </ul>
                            </div>
                          </div>
                      </React.Fragment>
                  )} />
                </div>
              </div>
            </div>
          </div>
        </div>   
        
      );
        
  }
}
