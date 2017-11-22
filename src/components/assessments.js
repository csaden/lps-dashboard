import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Assessment from './assessment';

export default class Assessments extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    data: PropTypes.array
  }

  render() {
    const {data, onClick} = this.props;
    return (
      <div className='assessments'>
        {_.map(data, (d) => {
          return (
            <Assessment
              key={d.key}
              assessment={d.value}
              onClick={onClick}
            />
          );
        })}
      </div>
    );
  }
}