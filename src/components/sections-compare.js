import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import * as d3 from 'd3';

const WIDTH = 450;
const ROW_HEIGHT = 50;
const MARGIN = {
  top: 60,
  right: 40,
  bottom: 0,
  left: 10
};

export default class SectionsCompare extends Component {

  static propTypes = {
    data: PropTypes.object
  }

  componentDidMount() {
    this.clearDotChart();
    this.createDotChart();
  }

  componentDidUpdate() {
    this.clearDotChart();
    this.createDotChart();
  }

  clearDotChart = () => {
    d3.selectAll('#sections-compare > *').remove();
  }

  createDotChart = () => {
    const {data} = this.props;
    const node = this.node;

    const standardIDs = _.uniq(_.flatten(_.map(data, (value) => {
      return _.map(value.standards, 'standardID');
    })));

    let height = ROW_HEIGHT * _.size(standardIDs);

    const width = WIDTH - MARGIN.left - MARGIN.right;
    height = height - MARGIN.top - MARGIN.bottom;

    const x = d3.scaleLinear()
      .domain([50, 100])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(standardIDs)
      .range([height, 0])
      .padding(0.1)

    const c = d3.scaleOrdinal()
      .domain(_.keys(data))
      .range(d3.schemeCategory10)

    const xAxis = d3.axisTop(x)
      .tickValues([50, 60, 70, 80, 90, 100])
      .tickSizeInner([-height])
      .tickPadding(10);

    const yAxis = d3.axisLeft(y);

    // add tooltip
    const tooltip = d3.select('.sections-compare-chart')
      .append('div')
      .attr('class', 'sections-compare-tooltip')

    const chart = d3.select(node)
      .attr('width', width + MARGIN.left + MARGIN.right)
      .attr('height', height + MARGIN.top + MARGIN.bottom)
      .append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    chart.append('g')
      .attr('class', 'sections-compare-x-axis')
      .style('stroke-dasharray', ('8', '8'))
      .call(xAxis);

    chart.append('g')
      .attr('class', 'sections-compare-y-axis')
      .call(yAxis);

    chart.select('.sections-compare-x-axis .domain').remove();
    chart.select('.sections-compare-y-axis').remove();

    _.forEach(data, (value, key) => {
      chart.selectAll(`.section-dot-${_.replace(key, '#', '')}`)
        .data(value.standards)
        .enter()
        .append('circle')
        .attr('class', `dot-${_.replace(key, '#', '')}`)
        .style('fill', c(key))
        .style('fill-opacity', 0.6)
        .attr('cx', (d) => x(d.avg))
        .attr('cy', (d) => y(d.standardID))
        .attr('r', (d) => 0)
        .on('mouseover', (d) => {
          tooltip
            .style('left', d3.event.pageX - 50 + 'px')
            .style('top', d3.event.pageY - 70 + 'px')
            .style('display', 'inline-block')
            .html(`Score: ${d.avg}<br>Teacher: ${d.teacherName}<br>Section: ${key}<br>Standard: ${d.standardTitle}`)
        })
        .on('mouseout', (d) => tooltip.style('display', 'none'))
        .transition()
        .duration(1000)
        .attr('r', (d) => 10);
    });

    // set legend section toggles to true / visible
    const legend = _.reduce(data, (legend, value, key) => {
      legend[key] = true;
      return legend;
    }, {});

    // add the toggle legend
    let i = 0;
    _.forEach(data, (value, key) => {
      d3.select(node).append('text')
        .attr('x', 0 + (70 * i))
        .attr('y', 20)
        .attr('class', 'legend')
        .style('cursor', 'pointer')
        .style('fill', c(key))
        .text(key)
        .on('click', () => {
          const active = legend[key] ? false : true;
          const opacity = active ? 1 : 0;
          d3.select(node).selectAll(`.dot-${_.replace(key, '#', '')}`).style('opacity', opacity)
          legend[key] = active;
        });
      i += 1;
    })
  }

  render() {
    return (
      <section>
        <div className='sections-compare'>
          <h2>Class Comparison</h2>
        </div>
        <div className='sections-compare-chart'>
          <svg
            id='sections-compare'
            ref={(node) => this.node = node}
          />
        </div>
      </section>
    );
  }
}