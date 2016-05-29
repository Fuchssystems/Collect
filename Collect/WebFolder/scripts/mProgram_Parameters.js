// Program part parametes

var app_Name = 'Collect'; // global application name
var app_Languages = {}; // application language
app_Languages.supported = ['en', 'de']; // supported languages: english, german
app_Languages.default_shortcut = app_Language_Best(); // default language best supported language
app_Languages.current_set = ''; // current language set

var menu_Main_Master = []; // Main menu bar Master
menu_Main_Master[0] = {}; // menu item
menu_Main_Master[0].id = 'Customers';
menu_Main_Master[0].Group = 'Admin'; // set to deactivated for Chat

menu_Main_Master[1] = {}; // menu item
menu_Main_Master[1].id = 'Administration_Main';
menu_Main_Master[1].Group = 'Admin';
menu_Main_Master[1].items = []; // sub menu

menu_Main_Master[1].items[0] = {}; // submenu item
menu_Main_Master[1].items[0].id = 'Administration_Webuser';
menu_Main_Master[1].items[0].Group = 'Admin';

menu_Main_Master[1].items[1] = {}; // submenu item
menu_Main_Master[1].items[1].id = 'Content';
menu_Main_Master[1].items[1].Group = 'Admin';

menu_Main_Master[2] = {}; // menu item
menu_Main_Master[2].id = 'Chat';
menu_Main_Master[2].Group = 'All';

menu_Main_Master[3] = {}; // menu item
menu_Main_Master[3].id = 'MyAccount';
menu_Main_Master[3].Group = 'All';
menu_Main_Master[3].items = []; // sub menu

menu_Main_Master[3].items[0] = {}; // submenu item
menu_Main_Master[3].items[0].id = 'User_Profile';
menu_Main_Master[3].items[0].Group = 'All';

menu_Main_Master[3].items[1] = {}; // submenu item
menu_Main_Master[3].items[1].id = 'User_Payments';
menu_Main_Master[3].items[1].Group = 'All';

menu_Main_Master[3].items[2] = {}; // submenu item
menu_Main_Master[3].items[2].id = 'User_Settings';
menu_Main_Master[3].items[2].Group = 'All';

menu_Main_Master[4] = {}; // menu item
menu_Main_Master[4].id = 'Windows';
menu_Main_Master[4].Group = 'All';
menu_Main_Master[4].items = []; // sub menu

menu_Main_Master[4].items[0] = {}; // submenu item
menu_Main_Master[4].items[0].id = 'My_camera';
menu_Main_Master[4].items[0].Group = 'All';

menu_Main_Master[5] = {}; // menu item
menu_Main_Master[5].id = 'About';
menu_Main_Master[5].Group = 'All';
menu_Main_Master[5].items = []; // sub menu

menu_Main_Master[5].items[0] = {}; // submenu item
menu_Main_Master[5].items[0].id = 'AGB';
menu_Main_Master[5].items[0].Group = 'All';

menu_Main_Master[5].items[1] = {}; // submenu item
menu_Main_Master[5].items[1].id = 'Impressum';
menu_Main_Master[5].items[1].Group = 'All';

var menu_Main_Display = []; // Main menu bar displayed

var prog_ID_Current = ''; // current program part ID (Welcome, FAQ,...)
var progPara = {}; // Pogram Parameters

progPara.Home = {}; // Program part Home
progPara.Home.kind = 'Component_Main';
progPara.Home.language = {}; // language
progPara.Home.language.en = {}; // english
progPara.Home.language.de = {}; // german
progPara.Home.language.en.window_Title_Main = 'Welcome';
progPara.Home.language.de.window_Title_Main = 'Willkommen';
progPara.Home.URL_Prog_Value = 'Home'; //  URL Value Program
progPara.Home.Component_Name = 'Home'; // Program name
progPara.Home.Component_Content = 'Welcome'; // Program content
progPara.Home.Logged_In_Only = false; // Must be logged in to use flag

progPara.Logged_in_Base = {}; // Program part Logged in base
progPara.Logged_in_Base.kind = 'Component_Main';
progPara.Logged_in_Base.language = {}; // language
progPara.Logged_in_Base.language.en = {}; // english
progPara.Logged_in_Base.language.de = {}; // german
progPara.Logged_in_Base.language.en.window_Title_Main = 'Logged in';
progPara.Logged_in_Base.language.de.window_Title_Main = 'Eingelogt';
progPara.Logged_in_Base.URL_Prog_Value = 'Logged_In_Base'; //  URL Value Program
progPara.Logged_in_Base.Component_Name = 'Home'; // Program name
progPara.Logged_in_Base.Component_Content = 'Logged_In_Base'; // Program content 
progPara.Logged_in_Base.Logged_In_Only = true; // Must be logged in to use flag

progPara.AGB = {}; // Program part AGB
progPara.AGB.kind = 'Component_Main';
progPara.AGB.language = {}; // language
progPara.AGB.language.en = {}; // english
progPara.AGB.language.de = {}; // german
progPara.AGB.language.en.window_Title_Main = 'Terms and Conditions';
progPara.AGB.language.de.window_Title_Main = 'AGB';
progPara.AGB.URL_Prog_Value = 'AGB'; //  URL Value Program
progPara.AGB.Component_Name = 'Home'; // Program name
progPara.AGB.Component_Content = 'AGB'; // Program content 
progPara.AGB.Logged_In_Only = false; // Must be logged in to use flag

progPara.Impressum = {}; // Program part Impressum
progPara.Impressum.kind = 'Component_Main';
progPara.Impressum.language = {}; // language
progPara.Impressum.language.en = {}; // english
progPara.Impressum.language.de = {}; // german
progPara.Impressum.language.en.window_Title_Main = 'About us';
progPara.Impressum.language.de.window_Title_Main = 'Impressum';
progPara.Impressum.URL_Prog_Value = 'Logged_In_Base'; //  URL Value Program
progPara.Impressum.Component_Name = 'Home'; // Program name
progPara.Impressum.Component_Content = 'Impressum'; // Program content
progPara.Impressum.Logged_In_Only = false; // Must be logged in to use flag 

progPara.Customers = {}; // Program part Customers
progPara.Customers.kind = 'Component_Main';
progPara.Customers.language = {}; // language
progPara.Customers.language.en = {}; // english
progPara.Customers.language.de = {}; // german
progPara.Customers.language.en.window_Title_Main = 'Customers';
progPara.Customers.language.de.window_Title_Main = 'Kunden';
progPara.Customers.URL_Prog_Value = 'Customers'; //  URL Value Program
progPara.Customers.Component_Name = 'Customers'; // Program name
progPara.Customers.Component_Content = null; // Program content 
progPara.Customers.Logged_In_Only = true; // Must be logged in to use flag

progPara.Administration_Webuser = {}; // Program part Administration Webuser
progPara.Administration_Webuser.kind = 'Component_Main';
progPara.Administration_Webuser.language = {}; // language
progPara.Administration_Webuser.language.en = {}; // english
progPara.Administration_Webuser.language.de = {}; // german
progPara.Administration_Webuser.language.en.window_Title_Main = 'Webuser administration';
progPara.Administration_Webuser.language.de.window_Title_Main = 'Webanwender vewalten';
progPara.Administration_Webuser.URL_Prog_Value = 'Administration_Webuser'; //  URL Value Program
progPara.Administration_Webuser.Component_Name = 'Webuser_Administration'; // Program name
progPara.Administration_Webuser.Component_Content = null; // Program content
progPara.Administration_Webuser.Logged_In_Only = true; // Must be logged in to use flag

progPara.Content = {}; // Program part Content
progPara.Content.kind = 'Component_Main';
progPara.Content.language = {}; // language
progPara.Content.language.en = {}; // english
progPara.Content.language.de = {}; // german
progPara.Content.language.en.window_Title_Main = 'Textvariables';
progPara.Content.language.de.window_Title_Main = 'Textvariablen';
progPara.Content.URL_Prog_Value = 'Content'; //  URL Value Program
progPara.Content.Component_Name = 'Content'; // Program name
progPara.Content.Component_Content = null; // Program content
progPara.Content.Logged_In_Only = true; // Must be logged in to use flag

progPara.Chat = {}; // Program part Chat
progPara.Chat.kind = 'Component_Main';
progPara.Chat.language = {}; // language
progPara.Chat.language.en = {}; // english
progPara.Chat.language.de = {}; // german
progPara.Chat.language.en.window_Title_Main = 'Chat english';
progPara.Chat.language.de.window_Title_Main = 'Chat deutsch';
progPara.Chat.URL_Prog_Value = 'Chat'; //  URL Value Program
progPara.Chat.Component_Name = 'Chat'; // Program name
progPara.Chat.Component_Content = null; // Program content
progPara.Chat.Logged_In_Only = true; // Must be logged in to use flag

progPara.User_Settings = {}; // Program part User settings
progPara.User_Settings.kind = 'Component_Main';
progPara.User_Settings.language = {}; // language
progPara.User_Settings.language.en = {}; // english
progPara.User_Settings.language.de = {}; // german
progPara.User_Settings.language.en.window_Title_Main = 'Settings';
progPara.User_Settings.language.de.window_Title_Main = 'Einstellungen';
progPara.User_Settings.URL_Prog_Value = 'Settings'; //  URL Value Program
progPara.User_Settings.Component_Name = 'User_Settings'; // Program name
progPara.User_Settings.Component_Content = null; // Program content
progPara.User_Settings.Logged_In_Only = true; // Must be logged in to use flag  

progPara.User_Profile = {}; // Program part User settings
progPara.User_Profile.kind = 'Component_Main';
progPara.User_Profile.language = {}; // language
progPara.User_Profile.language.en = {}; // english
progPara.User_Profile.language.de = {}; // german
progPara.User_Profile.language.en.window_Title_Main = 'Profile';
progPara.User_Profile.language.de.window_Title_Main = 'Profil';
progPara.User_Profile.URL_Prog_Value = 'Profile'; //  URL Value Program
progPara.User_Profile.Component_Name = 'User_Profile'; // Program name
progPara.User_Profile.Component_Content = null; // Program content  
progPara.User_Profile.Logged_In_Only = true; // Must be logged in to use flag

progPara.User_Payments = {}; // Program part User payments
progPara.User_Payments.kind = 'Component_Main';
progPara.User_Payments.language = {}; // language
progPara.User_Payments.language.en = {}; // english
progPara.User_Payments.language.de = {}; // german
progPara.User_Payments.language.en.window_Title_Main = 'Recharge account';
progPara.User_Payments.language.de.window_Title_Main = 'Konto aufladen';
progPara.User_Payments.URL_Prog_Value = 'User_Payments'; //  URL Value Program
progPara.User_Payments.Component_Name = 'User_Payments'; // Program name
progPara.User_Payments.Component_Content = null; // Program content  
progPara.User_Payments.Logged_In_Only = true; // Must be logged in to use flag

progPara.My_camera = {}; // Program part User payments
progPara.My_camera.kind = 'Floating_Window_Main';
progPara.My_camera.language = {}; // language
progPara.My_camera.language.en = {}; // english
progPara.My_camera.language.de = {}; // german
progPara.My_camera.language.en.window_Title_Main = 'My camera';
progPara.My_camera.language.de.window_Title_Main = 'Meine Kamera';
progPara.My_camera.Container_ID = 'container_My_camera'; 
progPara.My_camera.Dialog_Display = myWebcam_Container_show; // show container function
progPara.My_camera.Logged_In_Only = true; // Must be logged in to use flag


var widget_Pos_Saved = {};  // saved widget positions
var widget_Pos_Saved_Initialize = function () {
	if (!widget_Pos_Saved) widget_Pos_Saved = {}; // again defined here as global because .json can set variable to null
	
	if (!widget_Pos_Saved.Main) {
		widget_Pos_Saved.Main = {}; // saved positions main index page
	};
	if (!widget_Pos_Saved.Main.container_My_camera) {
		widget_Pos_Saved.Main.container_My_camera = {};
		widget_Pos_Saved.Main.container_My_camera.top = -1000; // -1000 indicates value not modified by user by dragging or resizing
		widget_Pos_Saved.Main.container_My_camera.left = -1000;	
	};
	
	if (!widget_Pos_Saved.Customers) {
		widget_Pos_Saved.Customers = {}; // saved positions program part Customers
	};
	if (!widget_Pos_Saved.Customers.autoForm_Customer_Detail) {
		widget_Pos_Saved.Customers.autoForm_Customer_Detail = {};
		widget_Pos_Saved.Customers.autoForm_Customer_Detail.top = -1000; // -1000 indicates value not modified by user by dragging or resizing
		widget_Pos_Saved.Customers.autoForm_Customer_Detail.left = -1000;
	};
	if (!widget_Pos_Saved.Customers.dataGrid_Pickups) {
		widget_Pos_Saved.Customers.dataGrid_Pickups = {};
		widget_Pos_Saved.Customers.dataGrid_Pickups.Top = -1000;
		widget_Pos_Saved.Customers.dataGrid_Pickups.Left = -1000;
	};
	
	if (!widget_Pos_Saved.Administration_Webuser) {
		widget_Pos_Saved.Administration_Webuser = {}; // saved positions program part Administration Webuser
	};
	if (!widget_Pos_Saved.Administration_Webuser.dialog_Transaction_Detail) {
		widget_Pos_Saved.Administration_Webuser.dialog_Transaction_Detail = {};
		widget_Pos_Saved.Administration_Webuser.dialog_Transaction_Detail.top = -1000; // -1000 indicates value not modified by user by dragging or resizing
		widget_Pos_Saved.Administration_Webuser.dialog_Transaction_Detail.left = -1000;
	};
	
	if (!widget_Pos_Saved.Chat) {
		widget_Pos_Saved.Chat = {}; // saved positions program part Administration Chat
	};
	if (!widget_Pos_Saved.Chat.component_Profile_1) {
		widget_Pos_Saved.Chat.component_Profile_1 = {};
		widget_Pos_Saved.Chat.component_Profile_1.top = -1000; // -1000 indicates value not modified by user by dragging or resizing
		widget_Pos_Saved.Chat.component_Profile_1.left = -1000;
	};
	if (!widget_Pos_Saved.Chat.component_Profile_1) {
		widget_Pos_Saved.Chat.component_Profile_1 = {};
		widget_Pos_Saved.Chat.component_Profile_1.top = -1000; // -1000 indicates value not modified by user by dragging or resizing
		widget_Pos_Saved.Chat.component_Profile_1.left = -1000;
	};
		
	if (!widget_Pos_Saved.component_Profile_2) {
		widget_Pos_Saved.Chat.component_Profile_2 = {};
		widget_Pos_Saved.Chat.component_Profile_2.top = -1000; // -1000 indicates value not modified by user by dragging or resizing
		widget_Pos_Saved.Chat.component_Profile_2.left = -1000;
	};
	if (!widget_Pos_Saved.Chat.component_Profile_2) {
		widget_Pos_Saved.Chat.component_Profile_2 = {};
		widget_Pos_Saved.Chat.component_Profile_2.top = -1000; // -1000 indicates value not modified by user by dragging or resizing
		widget_Pos_Saved.Chat.component_Profile_2.left = -1000;
	};
	
	if (!widget_Pos_Saved.Chat.container_Videochat) {
		widget_Pos_Saved.Chat.container_Videochat = {};
		widget_Pos_Saved.Chat.container_Videochat.top = -1000; // -1000 indicates value not modified by user by dragging or resizing
		widget_Pos_Saved.Chat.container_Videochat.left = -1000;
	};
	
	if (!widget_Pos_Saved.Chat.container_Chat_Filter) {
		widget_Pos_Saved.Chat.container_Chat_Filter = {};
		widget_Pos_Saved.Chat.container_Chat_Filter.top = -1000; // -1000 indicates value not modified by user by dragging or resizing
		widget_Pos_Saved.Chat.container_Chat_Filter.left = -1000;
	};
	
}; // end function widget_Pos_Saved.Initialize
widget_Pos_Saved_Initialize();
