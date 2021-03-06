import _ from 'lodash';
import * as d3 from 'd3';

import {A, B, C, D} from '../constants/grades';

export function groupDataByClass(data) {
  return d3.nest()
    .key(d => d.Section)
    .rollup(v => {
      return {
        teacherName: _.get(v, '[0].TeacherName'),
        courseName: _.get(v, '[0].CourseName'),
        assessments: v
      };
    })
    .object(data);
}

export function groupDataByStudent(data) {
  return d3.nest()
    .key(d => d.StudentID)
    .key(d => d.CourseName)
    .rollup(v => {
      const avg = getWeightedAvg(v);
      return {
        avg,
        letterGrade: getLetterGrade(avg),
        assessments: v
      };
    })
    .object(data);
}

export function getStandards(data, {Section}) {
  const {assessments} = data[Section];
  return getStandardAggregates(assessments);
}

export function getStudentScores(data, {Section, id, type}) {
  const idKey = type === 'standard' ? 'StandardID' : 'AssessmentID'
  let {assessments} = data[Section];
  assessments = _.filter(assessments, (a) => a[idKey] === id);


  return d3.nest()
    .key(d => d.StudentID)
    .rollup(v => {
      return {
        Score: getWeightedAvg(v),
        studentName: _.get(v, '[0].FirstName') + ' ' + _.get(v, '[0].LastName')
      };
    })
    .object(assessments);
}

export function getStandardCounts(data) {
  return _.size(_.uniq(_.map(data, 'StandardID')));
}

export function getClassComparisons(data, {Section}) {
  const sections = _.filter(data, (value, key) => {
    const {courseName} = data[Section];
    return value.courseName === courseName;
  })

  return _.reduce(sections, (avgsByStandard, {assessments}) => {
    const section = _.get(assessments, '[0].Section');
    const agg = getStandardAggregates(assessments);
    const averages = _.map(agg, ({avg, standardTitle, standardID}) => ({
      section: _.get(assessments, '[0].Section'),
      teacherName: _.get(assessments, '[0].TeacherName'),
      standardTitle,
      standardID,
      avg
    }));
    avgsByStandard[section] = {standards: averages};
    return avgsByStandard;
  }, {});
}

function getStandardAggregates(data) {
  return d3.nest()
    .key(d => d.StandardID)
    .rollup(v => {
      const s = getStudentStandardScores(v);
      return {
        standardID: _.get(v, '[0].StandardID'),
        standardTitle: _.get(v, '[0].StandardTitle'),
        standardType: _.get(v, '[0].StandardType'),
        assessmentCount: getAssessmentCount(v),
        assessments: getAssessmentAggregates(v),
        avg: getWeightedAvg(v),
        med: getMed(s),
        max: getMax(s),
        min: getMin(s),
        ...getLetterGradeCounts(s)
      };
    })
    .object(data);
}

function getStudentStandardScores(data) {
  const scores = d3.nest()
    .key(d => d.StudentID)
    .rollup(v => {
      return {
        Score: getWeightedAvg(v)
      };
    })
    .entries(data);
  return _.map(scores, 'value');
}

function getAssessmentAggregates(data) {
  return d3.nest()
    .key(d => d.AssessmentID)
    .rollup(v => ({
      assessmentID: _.get(v, '[0].AssessmentID'),
      assessmentTitle: _.get(v, '[0].AssessmentTitle'),
      ...getLetterGradeCounts(v),
      avg: getAvg(v),
      med: getMed(v),
      max: getMax(v),
      min: getMin(v)
    }))
    .entries(data);
}

function getAssessmentCount(data) {
  return _.uniq(_.map(data, 'AssessmentID')).length;
}

function getMax(data) {
  return d3.max(data, (d) => +d.Score);
}

function getMin(data) {
  return d3.min(data, (d) => +d.Score);
}

function getAvg(data) {
  return Math.round(d3.mean(data, (d) => +d.Score));
}

function getWeightedAvg(data) {
  const weights = d3.sum(data, (d) => d.Weight);
  return Math.round(d3.sum(data,  (d) => +d.Score * +d.Weight) / weights);
}

function getMed(data, key) {
  return d3.median(data, (d) => +d.Score);
}

function getLetterGradeCounts(data, assessmentID) {
  data = assessmentID ? _.filter(data, (row) => row.AssessmentID === assessmentID) : data;

  return _.reduce(data, (gradeCounts, row) => {
    if (row.Score >= A) {
      gradeCounts['A'] += 1;

    } else if (row.Score >= B) {
      gradeCounts['B'] += 1;

    } else if (row.Score >= C) {
      gradeCounts['C'] += 1;

    } else if (row.Score >= D) {
      gradeCounts['D'] += 1;
      gradeCounts['DF'] += 1;

    } else if (row.Score < D && row.Score >= 0) {
      gradeCounts['F'] += 1;
      gradeCounts['DF'] += 1;

    } else {
      gradeCounts['NA'] += 1;
    }

    return gradeCounts;

  }, {A: 0, B: 0, C: 0, D: 0, F: 0, DF: 0});
}

function getLetterGrade(score) {
  if (score >= 90) {
    return 'A';
  } else if (score >= 80) {
    return 'B';
  } else if (score >= 70) {
    return 'C'
  } else if (score >= 60) {
    return 'D';
  } else {
    return 'F';
  }
}
