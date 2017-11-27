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
    const {numStudents, count, letter} = this.props.data;
    const node = this.node;
    const yScale = d3.scaleLinear()
      .domain([0, numStudents])
      .range([0, HEIGHT]);

    // add tooltip
    const tooltip = d3.select('.letter-grade-count-chart')
      .append('div')
      .attr('class', 'letter-grade-count-tooltip')

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
      .on('mouseover', (d) => {
          tooltip
            .style('left', d3.event.pageX - 50 + 'px')
            .style('top', d3.event.pageY - 70 + 'px')
            .style('display', 'inline-block')
            .html(`${count} ${letter}s`)
        })
      .on('mouseout', (d) => tooltip.style('display', 'none'));
  }

  render() {
    return (
      <span className='letter-grade-count-chart'>
        <svg
          ref={(node) => this.node = node}
          width={WIDTH}
          height={HEIGHT}
        />
      </span>
    )
  }
}