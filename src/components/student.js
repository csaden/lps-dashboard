import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import GradesLineChart from './grades-line-chart';
import GradesBarChart from './grades-bar-chart';

export default class Student extends Component {

  static propTypes = {
    data: PropTypes.object,
    onClose: PropTypes.func
  }

  state = {
    isToggled: false,
    selectedAssessments: []
  }

  handleToggleAssessments = (event, courseKey) => {
    event.preventDefault();
    const {data} = this.props;
    this.setState(prevState => {
      return {
        [courseKey]: !prevState[courseKey],
        selectedAssessments: data[courseKey].assessments
      };
    });
  }

  render() {
    const {data, onClose} = this.props;
    const {selectedAssessments} = this.state;
    const row = data[_.keys(data)[0]].assessments[0];
    const studentName = row.FirstName + ' ' + row.LastName;

    return (
      <div>
        <button className='reset-btn' onClick={onClose}>close</button>
        <h2 className='student-name'>Student</h2>
        <div className='student-contain'>
          <table className='student-table'>
            <thead>
              <tr>
                <th>Score</th>
                <th>Grade</th>
                <th>Course</th>
              </tr>
            </thead>
            <tbody>
              {_.map(data, ({avg, letterGrade}, key) => {
                return (
                  <tr key={key}>
                    <td>{avg}</td>
                    <td>{letterGrade}</td>
                    <td>{key}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className='student-courses'>
          {_.map(data, ({assessments, avg}, key) => {
            const courseKey = _.replace(key, /[(]|[)]|[\s]|[.]|[:]/g, '');
            return (
              <span className='student-course' key={key}>
                <a
                  className='student-course-link'
                  onClick={(event) => this.handleToggleAssessments(event, key)}
                  href={`student-${key}`}>
                  <span>{key}</span>
                </a>
                <GradesLineChart data={assessments} courseKey={courseKey}/>
              </span>
            );
          })}
          </div>
          <div className='student-assessments'>
            <GradesBarChart data={selectedAssessments}/>
          </div>
        </div>
      </div>
    );
  }
}