import _ from 'lodash';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

const STUDENT_KEY = 'StudentID';
const WIDTH = 300;
const HEIGHT = 600;
const MARGIN = {
  top: 20,
  right: 40,
  bottom: 20,
  left: 80
};

export default class Students extends Component {

  static PropTypes = {
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
    d3.selectAll('#student-grades > *').remove();
  }

  createBarChart = () => {
    const {data} = this.props;
    const node = this.node;

    let students = _.map(data, (val, key) => ({
      [STUDENT_KEY]: key,
      score: val.Score
    }));
    students = students.sort((a, b) => {
      return d3.ascending(a.score, b.score);
    });

    const width = WIDTH - MARGIN.left - MARGIN.right;
    const height = HEIGHT - MARGIN.top - MARGIN.bottom;

    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(_.map(students, (s) => s[STUDENT_KEY]))
      .range([height, 0])
      .padding(0.1)

    const xAxis = d3.axisTop(x)
      .tickValues([0, 70, 100])
      .tickSizeInner([-height])
      .tickPadding(10);

    const yAxis = d3.axisLeft(y);

    // add tooltip
    const tooltip = d3.select('.students')
      .append('div')
      .attr('class', 'student-tooltip')

    const chart = d3.select(node)
      .attr('width', width + MARGIN.left + MARGIN.right)
      .attr('height', height + MARGIN.top + MARGIN.bottom)
      .append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    chart.append('g')
      .attr('class', 'student-grades-y-axis')
      .call(yAxis);


    chart.selectAll('.student-bar')
      .data(students)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .style('fill', '#984ea3')
      .attr('x', 0)
      .attr('y', (d) => y(d[STUDENT_KEY]))
      .attr('height', y.bandwidth())
      .on('mousemove', (d) => {
        tooltip
          .style('left', d3.event.pageX - 50 + 'px')
          .style('top', d3.event.pageY - 70 + 'px')
          .style('display', 'inline-block')
          .html(`Student: ${d[STUDENT_KEY]}<br>Score: ${d.score}`)
      })
      .on('mouseout', (d) => tooltip.style('display', 'none'))
      .transition()
      .duration(1000)
      .attr('width', (d) => x(d.score));

    chart.append('g')
      .attr('class', 'student-grades-x-axis')
      .call(xAxis);
  }

  render() {
    console.log(this.props.data);
    return (
      <section className='students'>
        <svg
          id='student-grades'
          ref={(node) => this.node = node}
        />
      </section>
    );
  }
}