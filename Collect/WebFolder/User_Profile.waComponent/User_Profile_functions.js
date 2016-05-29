// functions component User_Profile

// Load User_Documents
var User_Documents_Load = function () {
	sources.component_Main_user_Documents.query('Webuser.Directory_ID == :1',
		{
			orderBy: 'Main_Picture desc, ID asc',
			onSuccess: function (event) {

			}
		}, sources.webuser.Directory_ID	
	);
}; // end var User_Documents_Load
