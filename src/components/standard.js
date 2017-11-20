import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import StandardBar from './standard-bar';
import Assessments from './assessments';
import StandardHelper from '../utils/standards';

export default class Standard extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    standard: PropTypes.shape({
      assessmentCount: PropTypes.number,
      assessments: PropTypes.array,
      avg: PropTypes.number,
      med: PropTypes.number,
      max: PropTypes.number,
      min: PropTypes.number,
      standardID: PropTypes.string,
      standardTitle: PropTypes.string,
      standardType: PropTypes.string,
      A: PropTypes.number,
      B: PropTypes.number,
      C: PropTypes.number,
      D: PropTypes.number,
      F: PropTypes.number,
      DF: PropTypes.number
    })
  }

  state = {
    isToggled: false
  }

  handleStandardClick = (event) => {
    const {standard, onClick} = this.props;
    const {standardID, standardTitle} = standard;
    event.preventDefault();
    onClick({id: standardID, title: standardTitle, type: 'standard'});
  }

  handleToggleAssessents = (event) => {
    event.preventDefault();
    this.setState((prevState) => {
      return {isToggled: !prevState.isToggled};
    });
  }

  render() {
    const {standard, onClick} = this.props;
    const {
      standardID,
      assessmentCount,
      avg,
      med,
      max,
      min,
      A,
      B,
      C,
      D,
      F,
      DF
    } = standard;

    const {isToggled} = this.state;

    const title = StandardHelper.formatTitle(standard);

    return (

      <div className='standard-group'>
        <div className='standard'>
          <button
            className='toggle toggle-btn'
            onClick={this.handleToggleAssessents}>
            <i className={`Chevron ${isToggled ? 'Chevron-down' : 'Chevron-right'}`}/>
          </button>
          <span className='standard-link standard-title'>
            <a
              href={`#${standardID}`}
              onClick={this.handleStandardClick}>
              {title}
            </a>
          </span>
          <span className='standard-value'>{assessmentCount}</span>
          <span className='standard-bars'>
            {_.map({A, B, C, D, F}, (val, key) => {
              const data = {letter: key, count: val, numStudents: A + B + C + D + F}
              return (
                <StandardBar key={key} data={data}/>
              );
            })}
          </span>
          <span className='standard-value'>{DF}</span>
          <span className='standard-value'>{avg}</span>
          <span className='standard-value'>{med}</span>
          <span className='standard-value'>{max}</span>
          <span className='standard-value'>{min}</span>
        </div>
        {isToggled &&
          <Assessments
            data={standard.assessments}
            onClick={onClick}
          />
        }
      </div>
    );
  }
}
