import Controller from '@ember/controller';
import { computed } from '@ember/object';
import DetailMixin from '../mixins/detail';

export default Controller.extend(DetailMixin, {
    elasticRecord: computed('model.formattedmetadatarecordSet.@each.recordFormat', function() {
        const fmrs = this.get('model.formattedmetadatarecordSet');
        if (fmrs.length) {
            const fmr = fmrs.find(fmr => fmr.get('recordFormat') === 'sharev2_elastic');
            return fmr ? fmr.get('formattedMetadataJSON') : {};
        } else {
            return {};
        }
    }),
});
