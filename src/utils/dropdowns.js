import _ from 'lodash';

export default function getClassTupleValues(data) {
  const sections = _.map(data, (value, key) => {
    const {TeacherName, CourseName} = _.get(value, 'assessments[0]');
    return {Section: key, TeacherName, CourseName};
  });
  return mapOptions(sections);
}

function mapOptions(values) {
  return _.sortBy(_.map(values, ({Section, TeacherName, CourseName}) => {
    return {
      label: _.join([CourseName, TeacherName, Section], ' | '),
      value: Section
    };
  }), ['label', 'value']);
}
