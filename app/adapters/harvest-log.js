import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
	host: 'http://localhost:8000',
	namespace: 'api/v2',

	pathForType(){
		return 'HarvestLog';
	}
});
