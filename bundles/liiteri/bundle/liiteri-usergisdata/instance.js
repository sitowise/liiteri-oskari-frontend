/**
				    var key = textStatus;
				    try {
				        var jsonObject = jQuery.parseJSON(jqXHR.responseText);
				        if (jsonObject.hasOwnProperty('error'))
				            key = jsonObject['error'];
				    }
				    catch (e) { }
				    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
				    dialog.show(me.getLocalization('error'), key);
				    dialog.fadeout();
				});