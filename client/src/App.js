import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import './styles/global.css';

import Header from './components/Header';
import Public from './components/Courses';
import NotFound from './components/NotFound';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import CreateCourse from './components/CreateCourse';
import CourseDetails from './components/CourseDetails';
import Updatecourse from './components/UpdateCourse';
import ForbidenPage from './components/Forbidden';
import ErrorPage from './components/error';

import withContext from './Context';
import PrivateRoute from './routes/PrivateRoute';

const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const CreateCourseWithContext = withContext(CreateCourse);
const PublicWithContext = withContext(Public);
const CourseDetailsWithContext = withContext(CourseDetails);
const UpdateCourseWithContext = withContext(Updatecourse);

function App() {
    return (
        <Router>            
            <HeaderWithContext />

            <Switch>
                <Route exact path="/">
                    {<Redirect to="/courses" />}
                </Route>
                <Route exact path="/signin" component={UserSignInWithContext} />
                <Route exact path="/signup" component={UserSignUpWithContext} />
                <Route exact path="/signout" component={UserSignOutWithContext} />
                <PrivateRoute exact path="/courses/create" component={CreateCourseWithContext} />
                <PrivateRoute exact path="/courses/:id/update" component={UpdateCourseWithContext} />
                <Route exact path="/courses/:id" component={CourseDetailsWithContext} />
                <Route exact path="/courses" component={PublicWithContext} />
                <Route exact path="/forbidden" component={ForbidenPage} />
                <Route exact path="/notfound" component={NotFound} />
                <Route exact path="/error" component={ErrorPage} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
}

export default App;