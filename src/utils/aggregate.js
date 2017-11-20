import _ from 'lodash';
import * as d3 from 'd3';

import {A, B, C, D} from '../constants/grades';

export function groupDataByClass(data) {
  return d3.nest()
    .key(d => d.Section)
    .rollup(v => {
      return {assessments: v};
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
      };
    })
    .object(assessments);
}

export function getStandardCounts(data) {
  return _.size(_.uniq(_.map(data, 'StandardID')));
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
      assessmentID: _.get(v, '[0]AssessmentID'),
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
  return d3.max(data, (d) => +d.Score);
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
