Oskari.clazz.define('Oskari.coordinatetransformation.component.SourceSelect',
    function (loc) {
        var me = this;
        me.loc = loc;
        this.element = null;
        me._template = {
            sourceWrapper: jQuery('<div class="sourceWrapper"></div>'),
            source: _.template(
                '<div class="coordinate-datasource"> </br> ' +
                '<h4>${title}</h4>'+
                '<form>'+
                    '<input type="radio" id="clipboard" name="load" value="2"><label for="clipboard"><span></span> ${clipboard} </label>'+
                    '<input type="radio" id="file" name="load" value="1"><label for="file"> <span></span> ${file} </label>'+
                    '<input type="radio" id="mapselection" name="load" value="3"><label for="mapselection"> <span></span> ${map} </label>'+
                '</form>'+
                '</div>'
            ),
            info: _.template(
                '<div class="datasource-info">' +
                    '<div class="coordinateconversion-clipboardinfo" style=display:none;">'+
                        '<div class="clipboardinfo"> <i>${clipboardupload}<i> </div>'+
                    '</div>' +
                    '<div class="coordinateconversion-mapinfo" style=display:none;">'+
                        '<div class="mapinfo">'+
                            '<i>${mapinfo}<i> </br>'+
                            '<input type="button" class="selectFromMap" name="load" value="${map}">' +
                        '</div>' +
                    '</div>' +
                '</div>'
            )
        }
        this.createUi();
    }, {
        getName: function() {
            return 'Oskari.coordinatetransformation.components.SourceSelect';
        },
        setElement: function (el) {
            this.element = el;
        },
        getElement: function () {
            return this.element;
        },
        createUi: function () {
            if (this.element !== null) {
                return;
            }
            var wrapper = this._template.sourceWrapper.clone();

            var source = this._template.source({    
                title: this.loc.datasource.title, 
                file: this.loc.datasource.file,
                clipboard: this.loc.datasource.clipboard,
                choose: this.loc.datasource.choose,
                map: this.loc.datasource.map 
            });
            var info = this._template.info({ 
                clipboardupload: this.loc.dsInfo.clipboardupload,
                mapinfo: this.loc.dsInfo.mapinfo,
                map: this.loc.dsInfo.select
            });
            wrapper.append(source);
            wrapper.append(info);
            wrapper.find('.selectFromMap').addClass('primary');
            this.setElement(wrapper);
        }
    }
);
 