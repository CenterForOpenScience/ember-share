import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
        date_Started: 'dateStarted',
        end_Date: 'endDate',
        start_Date: 'startDate',
        harvester_Version: 'harvesterVersion',
    }
});
