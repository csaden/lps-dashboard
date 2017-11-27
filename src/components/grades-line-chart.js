import _ from 'lodash';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

const WIDTH = 200;
const HEIGHT = 150;
const MARGIN = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 25
};

export default class GradesLineChart extends Component {

  static propTypes = {
    courseKey: PropTypes.string,
    data: PropTypes.array
  }

  componentDidMount() {
    this.clearLineChart();
    this.createLineChart();
  }

  createLineChart = () => {
    let {data} = this.props;
    const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S'); // parse the date from TimeAdded field

    data = _.map(data, (row) => {
      return {
        Score: +row.Score,
        TimeAdded: parseTime(_.replace(row.TimeAdded, '+00:00', ''))  // "2017-08-23 21:11:23+00:00"
      };
    });
    data = _.sortBy(data, (d) => d.TimeAdded);
    const node = this.node;

    const width = WIDTH - MARGIN.left - MARGIN.right;
    const height = HEIGHT - MARGIN.top - MARGIN.bottom;

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    const maxDate = d3.max(data, (d) => d.TimeAdded);
    maxDate.setDate(maxDate.getDate() + 1);
    const minDate = d3.min(data, (d) => d.TimeAdded);

    const x = d3.scaleTime()
      .domain([minDate, maxDate])
      .rangeRound([0, width]);

    const line = d3.line()
      .x(d => x(d.TimeAdded))
      .y(d => y(d.Score))
      .curve(d3.curveLinear);

    const chart = d3.select(node)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    chart.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', y(60))
      .style('opacity', 0.5)
      .style('fill', '#dbe2e8');

    chart.append('rect')
      .attr('x', 0)
      .attr('y', y(60))
      .attr('width', width)
      .attr('height', y(40))
      .style('fill', '#dbe2e8');

    const yAxis = d3.axisLeft(y)
      .tickValues([0, 60, 100]);

    chart.append('g')
      .attr('class', 'student-grades-line-chart-y-axis')
      .call(yAxis);

    // add line for scores over time
    chart.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)
      .attr('stroke', '#863694')
      .attr('fill', 'none')
      .attr("stroke-width", 2)
  }

  clearLineChart = () => {
    const {courseKey} = this.props;
    d3.selectAll(`#student-grades-${courseKey} > *`).remove();
  }

  render() {
    const {courseKey} = this.props;

    return (
      <svg
        id={`student-grades-${courseKey}`}
        ref={(node) => this.node = node}
      />
    );
  }
}