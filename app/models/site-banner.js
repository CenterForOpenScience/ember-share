import DS from 'ember-data';

const { Model, attr } = DS;


export default Model.extend({
    title: attr('string'),
    description: attr('string'),
    color: attr('string'),
    icon: attr('string'),
});
