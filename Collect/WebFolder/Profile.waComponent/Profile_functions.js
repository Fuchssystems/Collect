// functions component Profile

// Load Chat Body text from server
// called by setInterval()
var Profile_Chat_Body_Load = function(Receiver_Webuser_ID, id_richText_Chat) {
	console.log(id_richText_Chat);
	ds.Chatmessage.Messages_Userpair_Load_HTML({
				onSuccess:function(event) {
					$$(id_richText_Chat).setValue(event.result);
				},
				onError:function(error) {
					alert('OnError ds.Chatmessage.Messages_Userpair_Load_HTML(');
				}
	},Receiver_Webuser_ID); // end ds.Chatmessage.Messages_CurrentUser_Load
}; // end var Profile_Chat_Body_Load

// make Profile detail text
var Profile_Detail_Text_Make = function (source) {
	var result = '<p>';
	var index = locStr_Profile.key.Array_Gender.indexOf(source.Gender);
	if (index !== -1) { // Gender has entry in key/name array
		result = locStr_Profile[sources.webuser.Preferences_Language_Shortcut].Array_Gender[index]; // Men, Women, Undetermined gender
		if (result) result += ' ';
		result += source.Age_in_Years_in_Brackets;
	}; // end if Gender has entry in key/name array	
	result += '</p><p>';
	result += source.Country_Code_Postal_Code_Formatted;
	if (source.Distance_to_Current_Webuser_String_Calculated) result += (' (' + source.Distance_to_Current_Webuser_String_Calculated + ')'); // pad (xx km)
	result += '<p>';
	
	return result;
}; // end var Profile_Detail_Text_Make