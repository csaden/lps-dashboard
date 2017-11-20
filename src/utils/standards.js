import _ from 'lodash';

export default {
  formatTitle({standardTitle}) {
    standardTitle = _.replace(standardTitle, /^students? will be able to /i, '');
    standardTitle = _.replace(standardTitle, /i can /ig, '');
    return _.capitalize(standardTitle);
  }
}
