import React from 'react'
import { Link } from 'react-router-dom';

export const ErrorPage : React.FC = () => {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}
