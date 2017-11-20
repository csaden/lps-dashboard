import _ from 'lodash';
import React, { Component } from 'react';
import Select from 'react-select';
import Papa from 'papaparse';

import getSelectOptions, {CLASS_TUPLE_JOIN_TEXT} from './utils/dropdowns';
import {
  groupDataByClass,
  getStandards,
  getStudentScores
} from './utils/aggregate';
import SELECTS from './constants/select';
import Standards from './components/standards';
import Students from './components/students';
import './App.css';
import 'react-select/dist/react-select.css';

class App extends Component {

  state = {
    data: null
  }

  handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    // http://papaparse.com/docs#config
    Papa.parse(file, {
      header: true,
      complete: this.setData,
      error: this.setError
    })
  }

  setData = ({data}) => {
    data = groupDataByClass(data);
    this.setState({data}, this.setClassTuples);
  }

  setError = (err, file, inputElem, reason) => {
    console.error(err);
    this.setState({error: `Unable to upload file ${file.name}: ${reason}`});
  }

  setClassTuples = () => {
    const {data} = this.state;
    this.setState({classes: getSelectOptions(data)});
  }

  setStandards = () => {
    const {classTuple, data, TeacherName, CourseName, Section} = this.state;
    if (classTuple) {
      const standards = getStandards(data, {TeacherName, CourseName, Section});
      this.setState({standards});
    }
  }

  handleSelectClass = (option) => {
    const classTuple = option ? option.value : null;
    const classKeys = _.zipObject(_.map(SELECTS, 'key'), classTuple.split(CLASS_TUPLE_JOIN_TEXT));
    this.setState({classTuple, ...classKeys}, this.setStandards);
  }

  handleStandardClick = ({id, title, type}) => {
    const {data, CourseName, TeacherName, Section} = this.state;
    const students = getStudentScores(data, {CourseName, TeacherName, Section, id, type});
    this.setState({selectedId: id, selectedTitle: title, students});
  }

  render() {
    const {
      data,
      error,
      classes,
      classTuple,
      standards,
      selectedId,
      selectedTitle,
      students
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">LPS Achievement</h1>
        </header>
        <main className='App-main'>
          <p className="App-intro">
            To get started, upload a file of JumpRope data.
          </p>
          <form>
            <input
              type='file'
              className='App-file-reader'
              onChange={this.handleFileUpload}
            />
            {error &&
              <p>{error}</p>
            }
          </form>
          {data &&
            <p className='App-intro'>Select the teacher, course, and section from the dropdowns to view class data.</p>
          }
          <div className='dashboard'>
            {classes &&
              <div className='standards'>
                <Select
                  className=' Select-class'
                  clearable={false}
                  onChange={this.handleSelectClass}
                  options={this.state.classes}
                  placeholder='Select class'
                  searchable={true}
                  value={classTuple}
                />
                <Standards
                  standards={standards}
                  onClick={this.handleStandardClick}
                />
              </div>
            }
            {selectedId &&
              <div className='students'>
                <div className='student-info'>
                  <h2 className='bold studen-title'>Standard/Assessment Details</h2>
                  <p>{selectedTitle}</p>
                </div>
                <Students
                  data={students}
                />
              </div>
            }
          </div>
        </main>
      </div>
    );
  }
}

export default App;
