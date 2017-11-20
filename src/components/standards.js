import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Standard from './standard';

export default class Standards extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    standards: PropTypes.object
  }

  static defaultProps = {
    standards: null
  }

  render() {
    const {onClick, standards} = this.props;

    return (standards &&
      <section className='standards'>
        <div className='standard'>
          <span className='toggle'/>
          <span className='bold standard-title'>Learning Targets ({_.size(standards)})</span>
          <span className='rotate standard-value'>Assessments</span>
          <span className='standard-bars labels'>
            <span className='bold standard-bar'>A</span>
            <span className='bold standard-bar'>B</span>
            <span className='bold standard-bar'>C</span>
            <span className='bold standard-bar'>D</span>
            <span className='bold standard-bar'>F</span>
          </span>
          <span className='bold standard-bar'>D/F</span>
          <span className='bold standard-value'>Avg</span>
          <span className='bold standard-value'>Med</span>
          <span className='bold standard-value'>Max</span>
          <span className='bold standard-value'>Min</span>
        </div>
        {standards &&
          _.map(standards, (standard) => {
            return (
              <Standard
                key={standard.standardID}
                standard={standard}
                onClick={onClick}
              />
            );
          })
        }
      </section>
    );
  }
}