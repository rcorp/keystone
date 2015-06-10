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
		if(this.props.value && this.props.value['addmoredatafield']) {
			_value = JSON.parse(this.props.value['addmoredatafield'])
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
		console.log("this", this)
		var _value = '';
		if(this.props.value && this.props.value['addmoredatafield']) {
			_value = JSON.parse(this.props.value['addmoredatafield'])
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
	

	uncollapseFields: function() {
		this.setState({
			collapsedFields: {}
		});
	},
	
	addMoreDataChanged: function(path, event) {
		var value = this.props.value || {};
		var _obj = {};
		for(var each in this.refs) {
			if(each != "addmoredatafield") {
				_obj[each] = React.findDOMNode(this.refs[each]).value
			}
		}
		this.setState({
			addmoredatafield:JSON.stringify(_obj)
		})
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
			if(each != "addmoredatafield") {
				if(each == event.path) {
					this.state.groupvalues[each] = _obj[each] = event.value
				}
			}
		}

		this.setState({
			addmoredatafield: JSON.stringify(this.state.groupvalues)
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
			var props = this.getFieldProps({
				path:ref + _el.name
			});
			props["ref"] = ref + _el.name
			props["label"] = _el.label

			switch (_el.type) {
				case "Date":
					elements[_el.type] = React.createElement(DateField,  props)
					break;
				case "String":
					elements[_el.type] = React.createElement(Text,  props)
					break;
				case "TextArea":
					elements[_el.type] = React.createElement(TextArea,  props)
					break;
				case "html":
					props["wysiwyg"] = true;
					elements[_el.type] = React.createElement(HTML,  props)
					break;
			}
		}

		/**
		 * CSS Style for Horizontal Line
		 * @type {Object}
		 */
		var hrStyle = {
			border:"10px double"
		};
		elements["line"] = <hr style={hrStyle}/>
		return elements;
		
	},

	renderAddMoreHiddenDataField: function() {
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">Add More Data Field</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls"><div className="form-row">
					<div className="col-xs-6">
						<input type="text" name={this.props.path + '.addmoredatafield'} ref="addmoredatafield" value={this.state.addmoredatafield || this.props.value.addmoredatafield} onChange={this.fieldChanged.bind(this, 'addmoredatafield')} className="form-control" placeholder="Add More Data Field" />
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
					{this.renderAddMoreHiddenDataField()}
				</div>
			</div>
		);
		
	}
	
});
