

import React from 'react';
import { Link } from 'react-router-dom';

export default class Header extends React.PureComponent {

    render() {
      if(this.props.context.authenticatedUser) {
        const name = this.props.context.authenticatedUser.firstName + '  ' + this.props.context.authenticatedUser.lastName;
        return (
          <>
            <div className = "header" >
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
              <link rel="shortcut icon" href="/favicon.ico" />
              <link href="https://fonts.googleapis.com/css?family=Work+Sans:400,500" rel="stylesheet" type="text/css" />
              <link href="https://fonts.googleapis.com/css?family=Cousine" rel="stylesheet" type="text/css" />
              <link href="../styles/global.css" rel="stylesheet" />
              <title>Courses</title>
                <div>
                    <div className="bounds">
                      <h1 className="header--logo">Courses</h1>
                      <nav><span>Welcome {name}!</span><a className="signout" href="/signout">Sign Out</a></nav>   
                    </div>
                </div>
              </div>
          </>
        )
      } else {
        return ( 
          <>
            <div className = "header" >
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
              <link rel="shortcut icon" href="/favicon.ico" />
              <link href="https://fonts.googleapis.com/css?family=Work+Sans:400,500" rel="stylesheet" type="text/css" />
              <link href="https://fonts.googleapis.com/css?family=Cousine" rel="stylesheet" type="text/css" />
              <link href="../styles/global.css" rel="stylesheet" />
              <title>Courses</title>              
                <div>
                    <div className="bounds">
                      <h1 className="header--logo">Courses</h1>
                      <nav><a className="signup" href="/signup">Sign Up</a><a className="signin" href="/signin">Sign In</a></nav>
                    </div>
                  </div>
              </div>
          </>
        );
      }
    }
};