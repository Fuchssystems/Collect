

model.Webuser_Preference.Chatfilter_Distance.events.load = function(event) {
	return isNaN(this.Chatfilter_Distance) ? 0 : this.Chatfilter_Distance;
};
