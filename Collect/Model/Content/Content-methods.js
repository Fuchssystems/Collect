

(model.Content.methods.Load_Name_Language = function(name_to_load, language_to_load) {
	// Load content entity for name and language
	if (!language_to_load) language_to_load = 'en'; // default language english
	return ds.Content.find('Name = :1 & Language = :2', name_to_load, language_to_load);
}).scope = "public";
