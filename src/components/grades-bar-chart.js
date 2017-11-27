import _ from 'lodash';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import wrap from '../utils/text';

const WIDTH = 400;
const HEIGHT = 400;
const MARGIN = {
  top: 20,
  right: 20,
  bottom: 5,
  left: 250
};

export default class GradesBarChart extends Component {

  static propTypes = {
    data: PropTypes.array
  }

  componentDidMount() {
    this.clearBarChart();
    this.createBarChart();
  }

  componentDidUpdate() {
    this.clearBarChart();
    this.createBarChart();
  }

  clearBarChart = () => {
    d3.selectAll(`#student-assessments-bar-chart > *`).remove();
  }

  createBarChart = () => {
    const node = this.node;
    const {data} = this.props;

    const width = WIDTH - MARGIN.left - MARGIN.right;
    const height = HEIGHT - MARGIN.top - MARGIN.bottom;

    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(_.map(data, (d) => d.AssessmentTitleRaw))
      .range([height, 0])
      .padding(0.1)

    const xAxis = d3.axisTop(x)
      .tickValues([0, 70, 100])
      .tickSizeInner([-height])
      .tickPadding(10);

    const yAxis = d3.axisLeft(y);

    const chart = d3.select(node)
      .attr('width', width + MARGIN.left + MARGIN.right)
      .attr('height', height + MARGIN.top + MARGIN.bottom)
      .append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    chart.append('g')
      .attr('class', 'student-grades-y-axis')
      .call(yAxis)
      .selectAll('.tick text')
      .call(wrap, 280);

    chart.selectAll('.student-assessment-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'student-assessment-bar')
      .style('fill', '#984ea3')
      .attr('x', 0)
      .attr('y', (d) => y(d.AssessmentTitleRaw))
      .attr('height', y.bandwidth())
      .transition()
      .duration(1000)
      .attr('width', (d) => x(+d.Score));

    chart.append('g')
      .attr('class', 'student-grades-x-axis')
      .call(xAxis);
  }

  render() {
    const {data} = this.props;

    return (_.size(data) > 0 &&
      <div className='grades-bar-chart'>
        <svg
          id='student-assessments-bar-chart'
          ref={(node) => this.node = node}/>
      </div>
    );
  }
}