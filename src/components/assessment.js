import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import StandardBar from './standard-bar';

export default class Assessment extends Component {

  static propTypes = {
    assessment: PropTypes.shape({
      assessmentID: PropTypes.string,
      assessmentTitle: PropTypes.string,
      avg: PropTypes.number,
      med: PropTypes.number,
      max: PropTypes.number,
      min: PropTypes.number,
      A: PropTypes.number,
      B: PropTypes.number,
      C: PropTypes.number,
      D: PropTypes.number,
      F: PropTypes.number,
      DF: PropTypes.number
    }),
    onClick: PropTypes.func
  }

  handleAssessmentClick = (event) => {
    event.preventDefault();
    const {assessment, onClick} = this.props;
    const {assessmentID, assessmentTitle} = assessment;
    onClick({id: assessmentID, title: assessmentTitle, type: 'assessment'});
  }

  render() {
    const {assessment} = this.props;
    const {
      assessmentID,
      assessmentTitle,
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
    } = assessment;

    return (
      <div className='standard'>
        <span className='toggle'>&nbsp;</span>
        <span className='standard-title'>
          <a
            href={`#${assessmentID}`}
            onClick={this.handleAssessmentClick}>
            {assessmentTitle}
          </a>
        </span>
        <span className='standard-value'>&nbsp;</span>
        <span className='standard-bars'>
          {_.map({A, B, C, D, F}, (val, key) => {
              const data = {letter: key, count: val, numStudents: A + B + C + D + F}
              return (
                <StandardBar key={`${assessmentID}-${key}`} data={data}/>
              );
            })}
        </span>
        <span className='standard-value'>{DF}</span>
        <span className='standard-value'>{avg}</span>
        <span className='standard-value'>{med}</span>
        <span className='standard-value'>{max}</span>
        <span className='standard-value'>{min}</span>
      </div>
    );
  }
}