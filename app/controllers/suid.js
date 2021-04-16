import Controller from '@ember/controller';
import { computed } from '@ember/object';
import DetailMixin from '../mixins/detail';

export default Controller.extend(DetailMixin, {
    elasticRecord: computed('model.formattedmetadatarecordSet.@each.recordFormat', function() {
        const fmrs = this.get('model.formattedmetadatarecordSet');
        if (fmrs.length) {
            const fmr = fmrs.find(fmr => fmr.get('recordFormat') === 'sharev2_elastic');
            return fmr ? fmr.get('formattedMetadataJSON') : null;
        } else {
            return null;
        }
    }),

    oaidcRecord: computed('model.formattedmetadatarecordSet.@each.recordFormat', function() {
        const fmrs = this.get('model.formattedmetadatarecordSet');
        if (fmrs.length) {
            const fmr = fmrs.find(fmr => fmr.get('recordFormat') === 'oai_dc');
            return fmr ? fmr.get('formattedMetadataXML') : null;
        } else {
            return null;
        }
    }),
});
