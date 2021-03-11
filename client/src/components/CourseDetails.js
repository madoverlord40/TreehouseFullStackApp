import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

export default class CourseDetails extends Component {

  state = {
    userName: '',
    course_title: '',
    course_description: '',
    course_materials: [],
    course_estimated_time: '',
    isAuthenticated: false,
    isAuthorized: false,
    courseOwner: '',
    errors: []
  }

  componentDidMount() {
    //get courses from server...
    const { context } = this.props;

    if(typeof(context) !== 'undefined') { 
        
        context.actions.getUserCourseById(this.props.match.params.id, this.updateCourseDetails, this.handleError);
    }
  }

  handleError = (error) => {
    if(error.isAxiosError) {
      if(error.response) {
        if(error.response.status === 401) {
          this.setState(() => {
            return { errors: [ 'Create Course was unsuccessful', error.response.data.message ] };
          });
        } else if(error.response.status === 404) {
            this.props.history.push('/notfound');
        } else {
          this.props.errors = [error.response.error]
          this.props.history.push('/error')
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


  updateCourseDetails = (response) => {
   //get courses from server...
   const { context } = this.props;
   const authenticatedUser = context.authenticatedUser;
   
    if(response !== 'undefined') {
        
      const authenticated = (authenticatedUser !== null && typeof(authenticatedUser) !== 'undefined');         
      
      const authorized = authenticated ?  (authenticatedUser.userId === response.userId) : false;

      let name = response.user.firstName + '  ' + response.user.lastName;

      const details = response;
      let materials = [];      

      if(details.materialsNeeded !== null ) {
        materials = details.materialsNeeded.split('\n');
        if(materials[materials.length -1] === '') {
          materials.splice(materials.length - 1, 1);
        }
      } else {
        materials.push('');
      }

      this.setState({
        userName: name,
        course_title: details.title,
        course_description: details.description,
        course_materials: materials,
        course_time: details.estimatedTime,
        isAuthenticated: authenticated,
        isAuthorized: authorized,
        courseOwner: name,
        errors: []
      })
    } else {
        this.props.errors = ['property response is not valid!']
        this.props.history.push('/error')
    }
  }

  renderMaterialsList() {
    let list = [];
    this.state.course_materials.forEach((element, index) => {
      list.push(<ReactMarkdown plugins={[gfm]} children={element} />)
    })

    return (
     list
    )
  }

  finishSubmit = (response) => {
    const { from } = this.props.location.state || { from: { pathname: '/courses' } };    
          
    this.setState(() => 
    {
      return { 
          userName: '',
          course_title: '',
          course_description: '',
          course_materials: [],
          course_estimated_time: '',
          isAuthenticated: false,
          isAuthorized: false,
          errors: []
      };
    });

    this.props.history.push(from);
  }

  handleUpdateCourseClick = (event) => {
    const id = this.props.match.params.id;
    this.props.history.push(`/courses/${id}/update`);
  }

  handleDeleteCourseClick = (event) => {
    //get courses from server...
    const { context } = this.props;

    if(typeof(context) !== 'undefined') { 
     context.actions.deleteCourseById(this.props.match.params.id, this.finishSubmit, this.handleError)
    }
  }

  renderUpdateCourseButton() {
    if(this.state.isAuthenticated && this.state.isAuthorized) {
      return (
        <>
          <a className="button" onClick={this.handleUpdateCourseClick}>Update Course</a>
          <a className="button" onClick={this.handleDeleteCourseClick}>Delete Course</a>
        </>
      )
    } else {
      return (<></>)
    }
  }

  render() {
    return (
      
        <div id="root">
          <div>
            <div>
              <div className="actions--bar">
              <div className="bounds">
                  <div className="grid-100">
                    <span>
                      {this.renderUpdateCourseButton()}
                    </span>
                    <a className="button button-secondary" href="/courses">Return to List</a></div>
                </div>
              </div>
              <div className="bounds course--detail">
                <div className="grid-66">
                  <div className="course--header">
                    <h4 className="course--label">Course</h4>
                    <h3 className="course--title">{this.state.course_title}</h3>
                    <p>By {this.state.courseOwner}</p>
                  </div>
                  <div className="course--description">
                    <ReactMarkdown plugins={[[gfm, {singleTilde: false}]]}>
                      {this.state.course_description}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="grid-25 grid-right">
                  <div className="course--stats">
                    <ul className="course--stats--list">
                      <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <h3>{this.state.course_time}</h3>
                      </li>
                      <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <ul>
                          {
                            this.renderMaterialsList()
                          }
                          
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            
    );
  }
}