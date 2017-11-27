import _ from 'lodash';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Modal from 'react-modal';

import Student from './student';

const STUDENT_KEY = 'StudentID';
const WIDTH = 400;
const HEIGHT = 600;
const MARGIN = {
  top: 20,
  right: 40,
  bottom: 40,
  left: 80
};

export default class Students extends Component {

  static PropTypes = {
    data: PropTypes.array,
    studentGrades: PropTypes.object
  }

  state = {
    student: {}
  }

  componentDidMount() {
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
    const tooltip = d3.select('.students-chart')
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
      .on('mouseover', (d) => {
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

    chart.selectAll('.student-grades-y-axis .tick')
      .on('click', (d) => {
        this.toggleStudentModal(d);
      });
  }

  toggleStudentModal = (id) => {
    const {studentGrades} = this.props;
    this.setState(prevState => {
      let student = {};
      if (!prevState.isModalOpen) {
        student = studentGrades[id];
      }
      return {
        student,
        isModalOpen: !prevState.isModalOpen
      };
    });
  }

  handleModalClose = () => {
    this.setState({student: {}, isModalOpen: false});
  }

  render() {
    const {isModalOpen, student} = this.state;

    return (
      <section className='students-chart'>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={this.handleModalClose}
          contentLabel='Student Details Modal'
          style={{
            overlay: {
              backgroundColor: 'rgba(46, 60, 73, 0.7)',
              zIndex: 1
            },
            content: {
              position: 'relative',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: '40px 20px'
            }
          }}>
          <Student data={student} onClose={this.handleModalClose}/>
        </Modal>
        <svg
          id='student-grades'
          ref={(node) => this.node = node}
        />
      </section>
    );
  }
}