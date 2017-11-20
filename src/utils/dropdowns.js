import _ from 'lodash';

export const CLASS_TUPLE_JOIN_TEXT = ' | ';

export default function getClassTupleValues(data) {
  const classTuples = _.reduce(_.keys(data), (tuples, courseName) => {
    const teacherNames = _.keys(data[courseName]);
    _.each(teacherNames, (teacherName) => {
      const sections = _.keys(data[courseName][teacherName]);
      _.each(sections, (section) => {
        const tuple = [courseName, teacherName, section];
        tuples.push(_.join(tuple, CLASS_TUPLE_JOIN_TEXT));
      });
    });
    return tuples;
  }, []);
  return mapOptions(classTuples);
}

function mapOptions(values) {
  return _.map(values, (value) => {
    return {
      label: value,
      value
    };
  });
}