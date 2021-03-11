import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class Forbidden extends Component {

    render() { 
        return (
        <div class="bounds">
            <h1>Internal Server Error</h1>
            <p>{this.props.errors}</p>
            <p>
                <Link to="/">Click here </Link> to go to the home page!
            </p>
        </div>
        
        )
    }
}