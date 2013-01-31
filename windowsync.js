var WindowSync = new function(){

	this.update_interval = 10000;
	this.prefix = "WindowSync/";
	this.prefix_window = this.prefix + "Window/";
	this.prefix_key = this.prefix + "Key/";

	this.id = ( this.prefix_window + Date.now() ) + Math.random();
	this.handler = function(){};
	this.windows = [];

	this.setItem = function(key, message){
		localStorage.setItem(this.prefix_key + key, message);
	};

	this.getItem = function(key){
		return localStorage.getItem(this.prefix_key + key);
	};

	this.setObject = function(key, object){
		this.setItem(key, JSON.stringify(object));
	};

	this.getObject = function(key){
		return eval(this.getItem(key));
	};

	this.setHandler = function(handler){
		this.handler = handler;
	};

	this.eventHandler = function(event){
		if(event.url.indexOf(location.origin + "/") == 0){
			if(event.key.indexOf(WindowSync.prefix_key) == 0){
				WindowSync.handler({
					oldValue: event.oldValue,
					newValue: event.newValue,
					key: event.key.substring(WindowSync.prefix_key.length),
					url: event.url
				});
			}
			else if(event.key.indexOf(WindowSync.prefix_window) == 0){
				if(event.oldValue == null && event.newValue != null){
					WindowSync.windows.push(event.key);
				}
				if(event.oldValue != null && event.newValue == null){
					var index = WindowSync.windows.indexOf(event.key);
					WindowSync.windows.splice(index, 1);
				}
			}
		}
	};

	var addevent = function(s, e){
		if(window.addEventListener)window.addEventListener(s, e, false);
		if(window.attachEvent)window.attachEvent('on'+s, e, false);
	};

	addevent('storage', this.eventHandler);
	addevent('beforeunload', function(){
		localStorage.removeItem(WindowSync.id);
	});

	for(var i = 0; i < localStorage.length; i++){
		var keyi = localStorage.key(i);
		if(keyi.indexOf(this.prefix_window) == 0){
			if(new Date().getTime() - parseInt(localStorage.getItem(keyi)) < this.update_interval * 2){
				this.windows.push(keyi);
			}
			else{
				localStorage.removeItem(keyi);
			}
		}
	}
	localStorage.setItem(this.id, new Date().getTime());
	setInterval(function(){
		localStorage.setItem(WindowSync.id, new Date().getTime());
	}, this.update_interval);

}();