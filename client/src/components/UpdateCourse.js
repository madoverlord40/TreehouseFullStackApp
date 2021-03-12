import React, { Component } from 'react';
import Form from './Form';

//UpdateCourse Component displayed with context in the router
export default class UpdateCourse extends Component {

  //stateful component, store the values of the form in the state, including errors
  state = {
    userName: '',
    title: '',
    description: '',
    materialsNeeded: '',
    estimatedTime: '',
    isAuthenticated: false,
    errors: []
  }

  //once the component has mounted, lets check to see if we are authenticated
  componentDidMount() {
    //get the context
    const { context } = this.props;

    //make sure its defined, sometimes it has been undefined here
    if(typeof(context) !== 'undefined') { 
        //are we authenticated? if so get the course info by id and populate the state
        if(context.authenticatedUser !== null) {
          context.actions.getUserCourseById(this.props.match.params.id, this.updateCourseDetails, this.handleError);
        } else {
          //we are not authenticated we cannot make any changes
          this.props.history.push('/forbidden');
        }
    }
    else {
      this.props.history.push('/error')
    }
  }

  //function callback for calling down to the context actions and fetching course data, once the data has been fetched, come in here and display
  updateCourseDetails = (response) => {

    const { context } = this.props;

    //once in a while response was undefined, to trap that error here just in case
    if(response !== 'undefined') {
        //lets make sure we are not trying to update data that does not belong to us, if not show forbidden page
        if(context.authenticatedUser.userId === response.userId) {
          let name = response.user.firstName + '  ' + response.user.lastName;

          const details = response;

          this.setState(
            {
              userName: name,
              title: details.title,
              description: details.description,
              materialsNeeded: details.materialsNeeded,
              estimatedTime: details.estimatedTime,
              isAuthenticated: authenticated,
              errors: []
            }
          )
        } else {
          this.props.history.push('/forbidden');
        }
    }
    else {
      this.props.history.push('/error');
    }
  }

  //function for dynamic DOM to populate the list for course materials
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

  //handle any errors that happened when fetching the course data with axios
  handleError = (error) => {
    if(error.isAxiosError) {
      if(typeof(error.response) !== 'undefined') {
        //if the error is within the 400 domain, set the state errors
        if(error.response.status > 399 && error.response.status < 500) {
          this.setState(() => {
            return { errors: [ error.response.data.errors ] };
          });
        }  else if (error.response.status >= 500) {
          this.props.history.push('/error');
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

  //function called post axios which is done when axios completes successfully.
  finishSubmit = (response) => {
    //reset the form data
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
      
      //take us back to the course details page for the course we just updated
      this.props.history.push(`/courses/${this.props.match.params.id}`);
  }

  //function to handle the form submit, calls update course in the context and passes handing functions
  handleSubmit = async (event) => {

    const { context } = this.props;
    const id = this.props.match.params.id;    
        
    const data = {
      "title": this.state.title,
      "description": this.state.description,
      "estimatedTime": this.state.estimatedTime,
      "materialsNeeded": this.state.materialsNeeded
    }

    context.actions.updateCourse(id, data, this.finishSubmit, this.handleError);
    
  }
  
  //cancle button click, return to the course detail page
  handleCancleClick = (event) => {
    this.props.history.push(`/courses/${this.props.match.params.id}`);
  }

  //on change event from the DOM when modifying the form fields.
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
                            <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." defaultValue={this.state.title} onChange={this.change} onBlur={this.change}/></div>
                            <p>By {this.state.userName}</p>
                        </div>
                        <div className="course--description">
                            <div><textarea id="description" name="description" className placeholder="Course description..." defaultValue={this.state.description} onChange={this.change} onBlur={this.change}/></div>
                        </div>
                        </div>
                        <div className="grid-25 grid-right">
                          <div className="course--stats">
                              <ul className="course--stats--list">
                              <li className="course--stats--list--item">
                                  <h4>Estimated Time</h4>
                                  <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" defaultValue={this.state.estimatedTime} onChange={this.change} onBlur={this.change}/></div>
                              </li>
                              <li className="course--stats--list--item">
                                  <h4>Materials Needed</h4>
                                  <div><textarea id="materialsNeeded" name="materialsNeeded" className placeholder="List materials..." defaultValue={this.state.materialsNeeded} onChange={this.change} onBlur={this.change}/></div>
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