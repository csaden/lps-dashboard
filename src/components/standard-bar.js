import PropTypes from 'prop-types';
import React, {Component} from 'react';
import * as d3 from 'd3';

const WIDTH = 20;
const HEIGHT = 60;

export default class StandardBar extends Component {

  static PropTypes = {
    data: PropTypes.arrayOf({
      letter: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      numStudents: PropTypes.number.isRequired
    })
  }

  componentDidMount() {
    this.createBarChart();
  }

  componentDidUpdate() {
    this.createBarChart();
  }

  createBarChart = () => {
    const {numStudents, count} = this.props.data;
    const node = this.node;
    const yScale = d3.scaleLinear()
      .domain([0, numStudents])
      .range([0, HEIGHT]);

    d3.select(node)
      .selectAll('rect')
      .data([count])
      .enter()
      .append('rect');

    d3.select(node)
      .selectAll('rect')
      .data([count])
      .exit()
      .remove();

    d3.select(node)
      .selectAll('rect')
      .data([count])
      .style('fill', '#984ea3')
      .attr('x', 0)
      .attr('y', (d) =>  HEIGHT - yScale(d))
      .attr('height', (d) => yScale(d))
      .attr('width', WIDTH)
  }

  render() {
    return (
      <svg
        ref={(node) => this.node = node}
        width={WIDTH}
        height={HEIGHT}
      />
    )
  }
}