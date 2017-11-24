import React, { Component } from 'react';
import Select from 'react-select';
import Papa from 'papaparse';

import getSelectOptions from './utils/dropdowns';
import {
  groupDataByClass,
  groupDataByStudent,
  getStandards,
  getStudentScores,
  getClassComparisons
} from './utils/aggregate';
import SectionsCompare from './components/sections-compare';
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
    const students = groupDataByStudent(data);
    data = groupDataByClass(data);
    this.setState({data, students}, this.setClassSelections);
  }

  setError = (err, file, inputElem, reason) => {
    console.error(err);
    this.setState({error: `Unable to upload file ${file.name}: ${reason}`});
  }

  setClassSelections = () => {
    const {data} = this.state;
    this.setState({classes: getSelectOptions(data)});
  }

  setStandards = () => {
    const {data, Section} = this.state;
    if (Section) {
      const standards = getStandards(data, {Section});
      this.setState({standards});
    }
  }

  handleSelectClass = (option) => {
    const Section = option ? option.value : null;
    this.setState({Section, selectedId: null}, this.setStandards);
  }

  handleStandardClick = ({id, title, type}) => {
    const {data, Section} = this.state;
    const students = getStudentScores(data, {Section, id, type});
    this.setState({selectedId: id, selectedTitle: title, selectedType: type, students});
  }

  handleResetClick = () => {
    this.setState({selectedId: null, selectedTitle: null, selectedType: null});
  }

  render() {
    const {
      data,
      error,
      classes,
      standards,
      Section,
      selectedId,
      selectedTitle,
      selectedType,
      students
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Student Achievement Data</h1>
        </header>
        <main className='App-main'>
          <div className='App-contain'>
            <p className="App-intro">
              To get started, upload a file of JumpRope data.
            </p>
            <form className='App-form'>
              <input
                id='App-file-reader'
                name='App-file-reader'
                type='file'
                className='App-file-reader'
                onChange={this.handleFileUpload}
              />
              <label htmlFor='App-file-reader'>Choose a file</label>
              {error &&
                <p>{error}</p>
              }
            </form>
          </div>
          {data &&
            <p className='App-select'>Select the teacher, course, and section from the dropdowns to view class data.</p>
          }
          <div className='dashboard'>
            {classes &&
              <div className='standards'>
                <Select
                  className=' Select-class'
                  clearable={false}
                  onChange={this.handleSelectClass}
                  options={classes}
                  placeholder='Select class'
                  searchable={true}
                  value={Section}
                />
              </div>
            }
            {selectedId &&
              <div className='students'>
                <h2 className='bold student-title'>{selectedType === 'assessment' ? 'Assessment' : 'Learning Target'} Details</h2>
                <button className='reset-btn' onClick={this.handleResetClick}>Close</button>
                <p>{selectedTitle}</p>
              </div>
            }
          </div>

          <div className='dashboard'>
            {Section &&
              <div className='standards'>
                <Standards
                  standards={standards}
                  onClick={this.handleStandardClick}
                />
              </div>
            }
            {Section && !selectedId &&
              <div className='students'>
                <SectionsCompare data={getClassComparisons(data, {Section})}/>
              </div>
            }
            {selectedId &&
              <div className='students'>
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
