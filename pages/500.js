/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import React, { Component, PropTypes } from 'react';

// TODO: https://github.com/babel/babel/issues/2983
export default class _class extends Component {

  static propTypes = {
    error: PropTypes.instanceOf(Error)
  };

  render() {
    return (
      <div>
        <h1>Error</h1>
        <pre>{
          this.props.error ?
          this.props.error.message + '\n\n' + this.props.error.stack :
            'A critical error occurred.'
        }</pre>
      </div>
    );
  }

}
