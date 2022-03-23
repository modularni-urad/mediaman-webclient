export default [{
  name: 'filename',
  label: 'filename',
  fieldcomponent: true,
  sortable: true
}, {
  name: 'nazev',
  component: 'dyn-input',
  fieldcomponent: true,
  label: 'název',
  rules: 'required',
  type: 'string',
  sortable: true
}, {
  name: 'tags',
  component: 'dyn-input',
  label: 'tagy',
  fieldcomponent: true,
  rules: 'required',
  type: 'string'
}, {
  name: 'popis',
  component: 'dyn-textarea',
  label: 'popis',
  type: 'string'
}]
