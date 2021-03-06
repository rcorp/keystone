/**
 * TODO:
 * - Custom path support
 */

var _ = require('underscore'),
	React = require('react'),
	Field = require('../Field'),
	Note = require('../../components/Note');


module.exports = Field.create({
	
	displayName: 'MediaThumbnailField',
	
	getInitialState: function() {
		return {
			collapsedFields: {},
			improve: false,
			overwrite: false
		};
	},
	
	componentWillMount: function() {
		
		var collapsedFields = {};
		
		// _.each(['number', 'name', 'videoThumbnailSRC', 'geo'], function(i) {
		// 	if (!this.props.value[i]) {
		// 		collapsedFields[i] = true;
		// 	}
		// }, this);
		console.log("this.props.value", this.props.value)
		this.setState({
			videoThumbnailSRC: this.props.value.videoThumbnailSRC
		});
		
	},
	
	componentDidUpdate: function(prevProps, prevState) {
		if (prevState.fieldsCollapsed && !this.state.fieldsCollapsed) {
			this.refs.number.getDOMNode().focus();
		}
	},
	

	fieldChanged: function(path, event) {
		var value = this.props.value;
		value[path] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: value
		});
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
	
	renderVideoId: function() {
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">Video Id</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls"><div className="form-row">
					<div className="col-xs-6">
						<input type="text" name={this.props.path + '.videoId'} ref="videoId" onBlur={this.requestYouTubeForThumbnail} value={this.props.value.videoId} onChange={this.fieldChanged.bind(this, 'videoId')} className="form-control" placeholder="Video Id" />
					</div>
				</div></div>
			</div>
		);
	},
	renderMediaURL: function() {
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">URL</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls"><div className="form-row">
					<div className="col-xs-6">
						<input type="text" name={this.props.path + '.url'} ref="url" value={this.state.url || this.props.value.url} onChange={this.fieldChanged.bind(this, 'url')} className="form-control" placeholder="URL" />
					</div>
				</div></div>
			</div>
		)
	},

	renderMediaTitle: function() {
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">Title</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls"><div className="form-row">
					<div className="col-xs-6">
						<input type="text" name={this.props.path + '.title'} ref="title" value={this.state.title || this.props.value.title} onChange={this.fieldChanged.bind(this, 'title')} className="form-control" placeholder="Title" />
					</div>
				</div></div>
			</div>
		)
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

	renderMediaThumbnail: function() {
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">Thumbnail</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls"><div className="form-row">
					<div className="col-xs-6">
						<input type="text" name={this.props.path + '.videoThumbnailSRC'} ref="videoThumbnailSRC" value={this.props.value.videoThumbnailSRC} onChange={this.fieldChanged.bind(this, 'videoThumbnailSRC')} className="form-control" placeholder="videoThumbnailSRC" />
						<img name={this.props.path + '.videoThumbnailSRC_Display'} ref="videoThumbnailSRC_Display"  src={this.props.value.videoThumbnailSRC} value={this.props.value.videoThumbnailSRC} className="form-control" />
					</div>
				</div></div>
			</div>
		);
	},
	renderStateAndPostcode: function() {
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">State/Postcode</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls"><div className="form-row">
					<div className="col-xs-6">
						<input type="text" name={this.props.path + '.state'} ref="state" value={this.props.value.state} onChange={this.fieldChanged.bind(this, 'state')} className="form-control" placeholder="State" />
					</div>
					<div className="col-xs-6">
						<input type="text" name={this.props.path + '.postcode'} ref="postcode" value={this.props.value.postcode} onChange={this.fieldChanged.bind(this, 'postcode')} className="form-control" placeholder="Postcode" />
					</div>
				</div></div>
			</div>
		);
	},
	
	renderGeo: function() {
		
		if (this.state.collapsedFields.geo) {
			return null;
		}
		
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">Lat / Lng</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls"><div className="form-row">
					<div className="col-xs-6">
						<input type="text" name={this.props.paths.geo} ref="geo1" value={this.props.value.geo ? this.props.value.geo[1] : ''} onChange={this.geoChanged.bind(this, 1)} placeholder="Latitude" className="form-control" />
					</div>
					<div className="col-xs-6">
						<input type="text" name={this.props.paths.geo} ref="geo0" value={this.props.value.geo ? this.props.value.geo[0] : ''} onChange={this.geoChanged.bind(this, 0)} placeholder="Longitude" className="form-control" />
					</div>
				</div></div>
			</div>
		);
		
	},
	
	updateGoogleOption: function(key, e) {
		var newState = {};
		newState[key] = e.target.checked;
		this.setState(newState);
	},
	
	renderGoogleOptions: function() {
		if (!this.props.enableMapsAPI) return null;
		var replace = this.state.improve ? (
			<label className="checkbox overwrite" htmlFor={this.props.paths.overwrite}>
				<input type="checkbox" name={this.props.paths.overwrite} id={this.props.paths.overwrite} value="true" onChange={this.updateGoogleOption.bind(this, 'overwrite')} checked={this.state.overwrite} />
				Replace existing data
			</label>
		) : null;
		return (
			<div className="row">
				<div className="col-sm-9 col-md-10 col-sm-offset-3 col-md-offset-2 improve-options">
					<label className="checkbox autoimprove" htmlFor={this.props.paths.improve} title="When checked, this will attempt to fill missing fields. It will also get the lat/long">
						<input type="checkbox" name={this.props.paths.improve} id={this.props.paths.improve} value="true" onChange={this.updateGoogleOption.bind(this, 'improve')} checked={this.state.improve} />
						Autodetect and improve location on save
					</label>
					{replace}
				</div>
			</div>
		);
	},
	
	requestYouTubeForThumbnail: function() {
		this.setState({videoThumbnailSRC: 'http://img.youtube.com/vi/' + event.target.value + '/0.jpg'});
		this.props.value.videoThumbnailSRC = 'http://img.youtube.com/vi/' + event.target.value + '/0.jpg';


		// var request = require('request');
		// request.get({
		// 	url:'https://www.youtube.com/watch?v=AeOydbt9e6g',
		// 	key:'AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU'
		// }, function() {
		// 	console.log(arguments)
		// })

		var YouTube = require('youtube-node');

		var youTube = new YouTube();
		var _this = this;
		youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

		youTube.getById(event.target.value, function(error, result) {
		  if (error) {
		    console.log(error);
		  }
		  else {
		    if(result && result.items && result.items[0]) {
			    var _item = result.items[0]
			    if(_item.snippet) {
			    	console.log(result)
					_this.setState({title: _item.snippet.title});
					_this.setState({description: _item.snippet.description});
					_this.setState({url: "https://www.youtube.com/watch?v=" + _item.id});
			    }
		    }

		  }
		});
	},

	renderUI: function() {
		
		return ( 
			<div className="field field-type-location">
				<div className="field-ui">
					<label>{this.props.label}</label>
					{this.renderVideoId()}
					{this.renderMediaThumbnail()}
					{this.renderMediaURL()}
					{this.renderMediaTitle()}
					{this.renderMediaDescription()}
					<Note note={this.props.note} />
				</div>
			</div>
		);
		
	}
	
});
