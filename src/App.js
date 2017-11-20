import React, { Component } from 'react';
import Select from 'react-select';
import Papa from 'papaparse';

import getSelectOptions from './utils/dropdowns';
import {
  groupDataByClass,
  getStandards,
  getStudentScores,
} from './utils/aggregate';
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
    this.setState({data}, this.setClassSelections);
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
    this.setState({Section}, this.setStandards);
  }

  handleStandardClick = ({id, title, type}) => {
    const {data, Section} = this.state;
    const students = getStudentScores(data, {Section, id, type});
    this.setState({selectedId: id, selectedTitle: title, selectedType: type, students});
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
                  value={Section}
                />
              </div>
            }
            {selectedId &&
              <div className='students'>
                <h2 className='bold studen-title'>{selectedType === 'assessment' ? 'Assessment' : 'Learning Target'} Details</h2>
                <p>{selectedTitle}</p>
              </div>
            }
          </div>

          <div className='dashboard'>
            {classes &&
              <div className='standards'>
                <Standards
                  standards={standards}
                  onClick={this.handleStandardClick}
                />
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
