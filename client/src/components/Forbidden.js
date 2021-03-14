import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class Forbidden extends Component {

    render() { 
        return (
        <div className="bounds">
            <h1>Forbidden</h1>
            <p>Oh oh! You can't access this page.</p>
            <p>
                <Link to="/">Click here </Link> to go to the home page!
            </p>
        </div>
        
        )
    }
}