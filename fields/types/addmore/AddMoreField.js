/**
 * TODO:
 * - Custom path support
 */

var _ = require('underscore'),
	React = require('react'),
	Field = require('../Field'),
	Fields = require('FieldTypes'),
	Note = require('../../components/Note');

var allFields = require('./fieldsRegistry')
var DateField = allFields.Date
var HTML = allFields.HTML
var TextArea = allFields.TextArea
var Text = allFields.Text



module.exports = Field.create({
	// mixins:[test],
	displayName: 'Add More',
	_values:{},
	getInitialState: function() {
		return {
			collapsedFields: {},
			improve: false,
			overwrite: false,
			count: [],
			name: '',
			values:{},
			groupvalues:{}
		};
	},
	
	componentWillMount: function() {
		var _value = '';
		if(this.props.value && this.props.value['description']) {
			_value = JSON.parse(this.props.value['description'])
		}

		var hashGroup = {};
		for(var each in _value) {
			var myRegexp = /ref_(\d+)/;
			var match = myRegexp.exec(each);
			if(hashGroup[match[1]]) {
				hashGroup[match[1]].push(each)
			} else {
				hashGroup[match[1]] = [];
				hashGroup[match[1]].push(each)
			}
		}

		for(each in hashGroup) {
			this.incrementCount();
		}
		this.setState({
			videoThumbnailSRC: this.props.value.videoThumbnailSRC
		});
		
	},
	_findDOMNode:function(domNode, ref, value) {
		if(domNode.children && domNode.children.length) {
			for(var i=0;i<domNode.children.length;i++) {
				var _dom = domNode.children[i]
				if(_dom.name == ref) {
					_dom.value = value;
					return _dom;
				} else {
					this._findDOMNode(_dom, ref, value)
				}
			}
		}
	},
	componentDidMount: function() {
		
		var _value = '';
		if(this.props.value && this.props.value['description']) {
			_value = JSON.parse(this.props.value['description'])
		}
		var _count = 0;
		var _this = this;
		// setTimeout(function() {
			for(var each in _value) {
				if(React.findDOMNode(_this.refs[each])) {
					var _domNode = _this._findDOMNode(React.findDOMNode(_this.refs[each]), each, _value[each])
					// _domNode.value = _value[each];
					// if(React.findDOMNode(_this.refs[each]).children[0] && React.findDOMNode(_this.refs[each]).children[0].children[0]) {
					// 	React.findDOMNode(_this.refs[each]).children[0].children[0].value = _value[each]
					// }
				}
			}
		// }, 1000)
	},
	
	componentDidUpdate: function(prevProps, prevState) {
		if (prevState.fieldsCollapsed && !this.state.fieldsCollapsed) {
			this.refs.number.getDOMNode().focus();
		}
	},
	
	shouldCollapse: function() {
		return false //this.formatValue() ? false : true;
	},
	
	uncollapseFields: function() {
		this.setState({
			collapsedFields: {}
		});
	},
	
	fieldChanged: function(path, event) {
		var value = this.props.value || {};
		value[path] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: value
		});
	},
	
	addMoreDataChanged: function(path, event) {
		var value = this.props.value || {};
		// value[path] = event.target.value;
		// this.props.onChange({
		// 	path: this.props.path,
		// 	value: value
		// });
		var _obj = {};
		// var _prevDescription = this.props.value.description || "{}"
		// _prevDescription = JSON.parse(_prevDescription)
		// for(var each in this.props.value) {
		// 	if(each != "description") {
		// 		_obj[each] = this.props.value[each]
		// 	}
		// }
		// for(each in _prevDescription) {
		// 	if(_obj[each] == undefined && each != "description") {
		// 		_obj[each] = _prevDescription[each]
		// 	}
		// }

		for(var each in this.refs) {
			if(each != "description") {
				_obj[each] = React.findDOMNode(this.refs[each]).value
			}
		}
		this.setState({
			description:JSON.stringify(_obj)
		})
	},

	geoChanged: function(i, event) {
		var value = this.props.value;
		if (!value.geo) {
			value.geo = ['', ''];
		}
		value.geo[i] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: value
		});
	},
	
	formatValue: function() {
		return _.compact([
			this.props.value.number,
			this.props.value.name,
			this.props.value.street1,
			this.props.value.street2,
			this.props.value.suburb,
			this.props.value.state,
			this.props.value.postcode,
			this.props.value.country
		]).join(', ');
	},
	
	renderValue: function() {
		return <div className="field-value">{this.formatValue() || '(no value)'}</div>;
	},
	
	renderField: function(path, label, collapse) {//eslint-disable-line no-unused-vars
		
		if (this.state.collapsedFields[path]) {
			return null;
		}
		
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">{label}</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls">
					<input type="text" name={this.props.path + '.' + path} ref={path} value={this.props.value[path]} onChange={this.fieldChanged.bind(this, path)} className="form-control" />
				</div>
			</div>
		);
		
	},
	
	renderDynamicTextBoxId: function(item , ref) {
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">Video Id</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls"><div className="form-row">
					<div className="col-xs-6">
						<input type="text" name={this.props.path + '.' + ref} ref= {ref} onChange={this.addMoreDataChanged.bind(this, ref)} className="form-control" placeholder="Video Id" />
					</div>
				</div></div>
			</div>
		);
	},
	getFieldProps: function(field) {
		var props = _.clone(field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'edit';
		return props;
	},
	
	handleChange: function(event) {
		var values = this.state.values;
		values[event.path] = event.value;

		var _obj = this.state.groupvalues;
		for(var each in this.refs) {
			if(each != "description") {
				if(each == event.path) {
					this.state.groupvalues[each] = _obj[each] = event.value
				}
			}
		}

		this.setState({
			description: JSON.stringify(this.state.groupvalues)
		});
	},

	fieldChanged: function(path, event) {
		var value = this.props.value;
		value[path] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: value
		});
	},

	renderGroupElements: function(item, ref) {
		
		var elements = {};

		for(var each in this.props.group) {
			var _el = this.props.group[each]
			_el["ref"] = ref
			// var props = _.clone(this.props);
			switch (_el.type) {
				case "Date":
					var props = this.getFieldProps({
						path:ref + _el.label
					});
					props["value"] = ''
					props["ref"] = ref + _el.label
					props["id"] = ref + _el.label
					elements[_el.type] = React.createElement(DateField,  props)
					// var props = this.getFieldProps({
					// 	path:"Date"
					// });
					// props["ref"] = ref + _el.label
					// props["onBlur"]=this.addMoreDataChanged.bind(this, props["ref"])
					// _el["props"] = props
					// elements[_el.type] = React.createElement(DateField, props)
					// elements[_el.type] = React.createElement('DateField', {
					// 	render: function() {
					// 		return <DateField label = {ref + _el.label} name={this.props.path + '.' + ref} ref= {ref} />
					// 	},
					// 	valueChanged: function(value) {
					// 		this.setDate(value);
					// 		this.addMoreDataChanged(arguments)
					// 	},
					// })
					// elements[_el.type] = <DateField label = "as" name={this.props.path + '.' + ref} ref= {ref} onChange={this.fieldChanged.bind(this, this.props.path + '.' + ref)}></DateField>
					break;
				case "String":
					var props = this.getFieldProps({
						path:ref + _el.label
					});
					props["value"] = ref + _el.label
					props["ref"] = ref + _el.label
					elements[_el.type] = React.createElement(Text,  props)

					// var props = this.getFieldProps({
					// 	path:"String"
					// });
					// props["ref"] = ref + _el.label
					// _el["props"] = props
					// // elements[_el.type] = React.createElement(Text,  props)
					// // elements[_el.type] = React.createElement(Text, props)

					// elements[_el.type] = <Text name={this.props.path + ref} onChange={this.fieldChanged.bind(this, ref)} />;	
					// elements[_el.type] = React.createElement('Text', {
					// 	render: function() {
					// 		return <Text label = {ref + _el.label} name={this.props.path + '.' + ref} ref= {ref} />
					// 	},
					// 	valueChanged: function(event) {
					// 		this.props.onChange({
					// 			path: this.props.path,
					// 			value: event.target.value
					// 		});
					// 		this.addMoreDataChanged(arguments)
					// 	}
					// })
					// elements[_el.type] = <Text label="asf" name={this.props.path + '.' + ref} ref= {ref} ></Text>
					break;
				case "TextArea":
					var props = this.getFieldProps({
						path:ref + _el.label
					});
					props["value"] = ref + _el.label
					props["ref"] = ref + _el.label
					elements[_el.type] = React.createElement(TextArea,  props)
					// elements[_el.type] = 						<input type="text" name={this.props.path + '.abcd'} ref="abcd" value={this.state.description || this.props.value.description} onChange={this.fieldChanged.bind(this, 'abcd')} className="form-control" placeholder="Description" />
					// elements[_el.type] = <TextArea label="asf" name={this.props.path + '.' + ref} ref= {ref} onChange={this.fieldChanged}></TextArea>
					break;
			}
		}

			// switch (_el.type) {
			// 	case "Date":
			// 	elements[_el.type] = React.createElement(DateField, _el)
			// 	break;
			// 	case "String":
			// 	elements[_el.type] = React.createElement(Text, _el)
			// 	break;
			// }
		
		return elements;
		
	},

	renderMediaDescription: function() {
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">Description</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls"><div className="form-row">
					<div className="col-xs-6">
						<input type="text" name={this.props.path + '.description'} ref="description" value={this.state.description || this.props.value.description} onChange={this.fieldChanged.bind(this, 'description')} className="form-control" placeholder="Description" />
					</div>
				</div></div>
			</div>
		)
	},


    incrementCount: function(){
      var name = "dynamic_AddMore_";
      name = this.makeUpper(name);
      this.state.count.push(name + " : " + this.state.count.length);
      this.setState({
        count: this.state.count,
        name: name
      });
    },
    makeUpper:function(name) {
      return name.toLowerCase()
    },

	renderUI: function() {
		var _this = this;
		if (!this.shouldRenderField()) {
			return (
				<div className="field field-type-location">
					<label className="field-label">{this.props.label}</label>
					<div className="field-ui noedit">
						{this.renderValue()}
					</div>
				</div>
			);
		}
		
		/* eslint-disable no-script-url */
		var showMore = !_.isEmpty(this.state.collapsedFields)
			? <a href="javascript:;" className="field-label-companion" onClick={this.uncollapseFields}>(show more fields)</a>
			: null;
		/* eslint-enable */
		
		return ( 
			<div className="field field-type-location">
				<div className="field-ui">
					<label>{this.props.label}</label>
	                {
	                  this.state.count.map(function(item, count) {
	                    var _ref = "ref_" + count
	                    return _this.renderGroupElements(item, _ref)
	                  })
	                 }
	                <button type="button" onClick={this.incrementCount}>Add More</button>
					{this.renderMediaDescription()}
				</div>
			</div>
		);
		
	}
	
});
