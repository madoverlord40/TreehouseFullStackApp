import React, { Component } from 'react';
import Form from './Form';

export default class UpdateCourse extends Component {

  state = {
    userName: '',
    title: '',
    description: '',
    materialsNeeded: '',
    estimatedTime: '',
    isAuthenticated: false,
    errors: []
  }

  componentDidMount() {
    //get courses from server...
    const { context } = this.props;

    if(typeof(context) !== 'undefined') { 
        if(context.authenticatedUser !== null) {
          context.actions.getUserCourseById(this.props.match.params.id, this.updateCourseDetails, this.handleError);
        } else {
          this.props.history.push('/forbidden');
        }
    }
    else {
      this.props.errors = ['property context is not valid!']
      this.props.history.push('/error')
    }
  }

  updateCourseDetails = (response) => {
   //get courses from server...
   const { context } = this.props;

    if(response !== 'undefined') {
      const authenticated = (context.authenticatedUser !== null && typeof(context.authenticatedUser) !== 'undefined');
        if(authenticated) {

            if(context.authenticatedUser.userId === response.userId) {
              let name = response.user.firstName + '  ' + response.user.lastName;

              const details = response;

              this.setState({
                  userName: name,
                  title: details.title,
                  description: details.description,
                  materialsNeeded: details.materialsNeeded,
                  estimatedTime: details.estimatedTime,
                  isAuthenticated: authenticated,
                  errors: []
              })
            } else {
              this.props.history.push('/forbidden');
            }
        }
        else {
          this.props.history.push('/forbidden');
        }
    } else {
      this.props.errors = ['property response is not valid!']
      this.props.history.push('/error')
    }
  }

  renderMaterialsList = () => {
    let list = [];
    this.state.course_materials.forEach((element, index) => {
      list.push(
          <>
            <li>{element}</li>
          </>
        )
    })

    return (
     list
    )
  }

  handleError = (error) => {
    if(error.isAxiosError) {
      if(typeof(error.response) !== 'undefined') {
        if(error.response.status > 399) {
          this.setState(() => {
            return { errors: [ 'Create Course was unsuccessful', error.response.data.message ] };
          });
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

  finishSubmit = (response) => {
    
    this.setState(() => 
      {
        return { 
            userName: '',
            title: '',
            description: '',
            materialsNeeded: '',
            estimatedTime: '',
            isAuthenticated: false,
            errors: []
        };
      });
      const { from } = this.props.location.state || { from: {pathname: `/courses/${this.props.match.params.id}`}  };
      this.props.history.push(from);
  }

  handleSubmit = async (event) => {

    const { context } = this.props;
    const id = this.props.match.params.id;    
        
    let data = {
      "title": this.state.title,
      "description": this.state.description,
      "estimatedTime": this.state.estimatedTime,
      "materialsNeeded": this.state.materialsNeeded
    }

    context.actions.updateCourse(id, data, this.finishSubmit);
    
  }
  

  handleCancleClick = (event) => {
    this.props.history.push(`/courses/${this.props.match.params.id}`);
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
    return (
      
        <div id="root">
          <div className="bounds course--detail">
            <h1>Update Course</h1>
          <div>
          <Form
              cancel={this.handleCancleClick}
              errors={this.state.errors}
              submit={this.handleSubmit}
              className="grid-100 pad-bottom"
              submitButtonText='Update Course'
              elements={() => (
                  <React.Fragment>
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." defaultValue={this.state.title} onChange={this.change}/></div>
                            <p>By {this.state.userName}</p>
                        </div>
                        <div className="course--description">
                            <div><textarea id="description" name="description" className placeholder="Course description..." defaultValue={this.state.description} onChange={this.change}/></div>
                        </div>
                        </div>
                        <div className="grid-25 grid-right">
                          <div className="course--stats">
                              <ul className="course--stats--list">
                              <li className="course--stats--list--item">
                                  <h4>Estimated Time</h4>
                                  <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" defaultValue={this.state.estimatedTime} onChange={this.change}/></div>
                              </li>
                              <li className="course--stats--list--item">
                                  <h4>Materials Needed</h4>
                                  <div><textarea id="materialsNeeded" name="materialsNeeded" className placeholder="List materials..." defaultValue={this.state.materialsNeeded} onChange={this.change}/></div>
                              </li>
                              </ul>
                          </div>                                
                        </div>
                  </React.Fragment>
              )} />    
            </div>
        </div>
      </div>
            
    );
  }
}