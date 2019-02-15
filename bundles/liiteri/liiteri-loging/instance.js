/**
 * @class Oskari.liiteri.bundle.liiteri-loging.LiiteriLogingBundleInstance
 * 
 * Add this to startupsequence to get this bundle started { title :
 * 'guidedtour', fi : 'guidedtour', sv : '?', en : '?', bundlename :
 * 'guidedtour', bundleinstancename : 'guidedtour', metadata : { "Import-Bundle" : {
 * "guidedtour" : { bundlePath : '/<path to>/packages/framework/bundle/' } },
 * "Require-Bundle-Instance" : [] }, instanceProps : {} }
 */
Oskari.clazz
    .define(
        "Oskari.liiteri.bundle.liiteri-loging.LiiteriLogingBundleInstance",

        /**
         * @method create called automatically on construction
         * @static
         */

        function(locale) {
          this.sandbox = null;
          this._localization = locale != null ? locale : Oskari
              .getLocalization(this.getName());
          this.mediator = null;
          this.guideStep = 0;
          this.selection = null;
          this.dialog = null;
          this.templates = {
            'page1Header' : '<div class="headerContainer"><h3>'
                + this._localization.page1.welcomeTitle + '</h3><p>'
                + this._localization.page1.welcomeMessage + '</p><div class="logo"></div></div>',
            'page2Header' : '<div class="headerContainer"><h3>'
                    + this._localization.page2.title + '</h3><p>'
                    + '</p><div class="logo"></div></div>',
            'footer' : '<div class="footerContainer">',
            'incorrectLogin': '<div class="alert alert-danger" role="alert">' + this._localization.page1.incorrectLogin + '</div>',
            'externalLoginForm' :
                 '<div class="form-item">'
                + '<div class="row2">'
                + '<div class="form-item"><div class="form-tile">'
                + '<span class="login-ext login-oiva link">'
                + this._localization.page1.oivaLogin
                + '</span><br/><span class="link-extra register-oiva link">'
                + this._localization.page1.oivaRegister
                + '</span></div><div class="form-tile"><span class="login-ext login-ida link">'
                + this._localization.page1.idaLogin
                + '</span><br/><span class="link-extra register-ida link">'
                + this._localization.page1.idaRegister
                + '</span></div><div class="form-tile"><span class="guest link">'
                + this._localization.page1.continueAsGuest
                + '</span><br/><div class="guest extraMessage">'
                + this._localization.page1.continueAsGuestInfo
                + '</div></div>'
                + '</div></div></div>',
            'loginForm' : '<form action="j_security_check" method="post" accept-charset="UTF-8">'
                + '<div>' + '<div class="form-item"><label for="username">'
                + this._localization.page1.username
                + '</label>'
                + '<input class="form-text" id="username" name="j_username" type="text" placeholder="" autofocus="" required="" oninvalid="this.setCustomValidity(\'' + this._localization.page1.fillField + '\')" oninput="setCustomValidity(\'\')"></div>'
                + '<div class="form-item"><label for="password">'
                + this._localization.page1.password
                + '</label>'
                + '<input class="form-text" id="password" name="j_password" type="password" placeholder="" required="" oninvalid="this.setCustomValidity(\'' + this._localization.page1.fillField + '\')" oninput="setCustomValidity(\'\')"></div>'
                + '<div class="form-item">'
                + '<div><input type="checkbox"/><span>'
                + this._localization.page1.rememberLogged
                + '</span></div>'
                + '<div><input type="checkbox"/><span>'
                + this._localization.page1.acceptConditions
                + '</span></div>'
                + '</div>'
                + '<div class="form-item">'
                + '<div class="row2">'
                + '<input type="submit" id="submit" value="'
                + this._localization.page1.login
                + '"> <span class="register link">'
                + this._localization.page1.register
                + '</span> <span class="guest link">'
                + this._localization.page1.continueAsGuest
                + '</span>'
                + '</div>' + '</div>' + '</div>' + '</form>',
            'buttons' : '<div><input type="submit" id="submit" value="'
                + this._localization.page2.confirm + '"></div>'
          }
        },
        {
          /**
           * @static
           * @property __name
           */
          __name : 'liiteri-loging',

          /**
           * @method getName Module protocol method
           */
          getName : function() {
            return this.__name;
          },

          /**
           * @method getTitle Extension protocol method
           * @return {String} localized text for the title of the component
           */
          getTitle : function() {
            return this._localization['title'];
          },

          /**
           * @method getDescription Extension protocol method
           * @return {String} localized text for the description of the
           *         component
           */
          getDescription : function() {
            return this._localization['desc'];
          },

          /**
           * @method getSandbox Convenience method to call from Tile and Flyout
           * @return {Oskari.mapframework.sandbox.Sandbox}
           */
          getSandbox : function() {
            return this.sandbox;
          },

          /**
           * @method update BundleInstance protocol method
           */
          update : function() {
          },

          /**
           * @method start BundleInstance protocol method
           */
          start : function() {
            if (!this._localization) {
              this._localization = Oskari.getLocalization(this.getName());
            }

            // Check cookie 'pti_tour_seen'. Value '1' means that
            // tour
            // is not to be started
            // jQuery cookie plugin:
            // resources/framework/bundle/guidedtour/js/jquery.cookie.js
            // github.com/carhartl/jquery-cookie/
            var me = this, conf = me.conf, // Should this not come
            // as a param?
            sandboxName = (conf ? conf.sandbox : null) || 'sandbox', sandbox = Oskari
                .getSandbox(sandboxName);
            me.sandbox = sandbox;
            // register to sandbox as a module
            sandbox.register(me);
            var user = Oskari.user();
            if (!user.isLoggedIn()) {
              me._startGuide();
            } else {
              if (typeof user.getTosAccepted() === 'undefined' || user.getTosAccepted() === null) {
                me._startGuide(1);
              }
            }

            var requestHandler = Oskari.clazz
                .create(
                    'Oskari.liiteri.bundle.liiteri-loging.request.ShowLoginWindowRequestHandler',
                    this);
            sandbox.addRequestHandler('liiteri-loging.ShowLoginWindowRequest',
                requestHandler);
          },
          showMessage: function (title, message, buttons) {
              if (this.dialog) {
                  this.dialog.close(true);
                  this.dialog = null;
              }

              var me = this,
                  loc = this._localization,
                  dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
              if (buttons) {
                  dialog.show(title, message, buttons);
              } else {
                  var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                  okBtn.setTitle(loc.button.close);
                  okBtn.addClass('primary');
                  okBtn.setHandler(function () {
                      dialog.close(true);
                      me.dialog = null;
                  });
                  dialog.show(title, message, [okBtn]);
                  me.dialog = dialog;
              }
              
              return dialog;
          },
          showLoginWindow : function() {
            this._startGuide();
          },
          _startGuide : function(step) {
            var me = this, pn = 'Oskari.userinterface.component.Popup', dialog = Oskari.clazz
                .create(pn);
            me.guideStep = 0;
            if (typeof step !== 'undefined') {
              me.guideStep = step;
            }
            dialog.addClass('loging-window');
            var overlay = Oskari.clazz
                .create('Oskari.userinterface.component.Overlay');
            me._showGuideContentForStep(me.guideStep, dialog, overlay, me);
          },
          _getURLParameter : function (sParam) {
                var pageurl = window.location.search.substring(1);
                var urlVariables = pageurl.split('&');
                for (var i = 0; i < urlVariables.length; i++)
                {
                    var sParameterName = urlVariables[i].split('=');
                    if (sParameterName[0] == sParam) 
                    {
                        return sParameterName[1];
                    }
                }
              return null;
          },
          _guideSteps : [
              {
                appendTourSeenCheckbox : false,

                setScope : function(inst) {
                  this.ref = inst;
                },
                getTitle : function() {
                  return this.ref._localization.page1.welcomeTitle;
                },
                getContent : function(dialog, overlay, me) {
                  var content = jQuery('<div></div>');
                  var header = jQuery(this.ref.templates.page1Header);
                  var footer = jQuery(this.ref.templates.footer);

                  var bodyContainer = jQuery('<div class="bodyContainer"></div>');

                  var loginContainer = jQuery('<div class="loginContainer"></div>');
                  if (me._getURLParameter('loginState') == 'failed') {
                      loginContainer.append(jQuery(this.ref.templates.incorrectLogin));
                  }

                  if ((typeof me.conf["authentication"] != "undefined") &&
                        (me.conf["authentication"] == "ida")) {
                      loginContainer.append(
                          jQuery(this.ref.templates.externalLoginForm));
                  } else {
                      loginContainer.append(
                          jQuery(this.ref.templates.loginForm));
                  }
                  loginContainer
                      .find(".guest")
                      .click(
                          function() {
                            var eventBuilder = me.sandbox.getEventBuilder('liiteri-loging.LoginEvent');
                            var event = eventBuilder("guest");
                            me.sandbox.notifyAll(event);
                            jQuery.cookie('guest_login', 1);
                            dialog.close(true);
                            overlay.close();
                            me._startGuide(1);
                          });
                  loginContainer
                  .find(".login-oiva")
                  .click(function () {
                      var eventBuilder = me.sandbox.getEventBuilder('liiteri-loging.LoginEvent');
                      var event = eventBuilder("oiva");
                      me.sandbox.notifyAll(event);
                      var loginUrl = me.conf["loginUrlOiva"];
                      window.location.href = loginUrl;
                  });
                  loginContainer
                  .find(".login-ida")
                  .click(function () {
                      var eventBuilder = me.sandbox.getEventBuilder('liiteri-loging.LoginEvent');
                      var event = eventBuilder("iida");
                      me.sandbox.notifyAll(event);
                      var loginUrl = me.conf["loginUrlIda"] + "&returnUrl=" + encodeURIComponent(window.location.href);
                      window.location.href = loginUrl;
                  });
                  loginContainer
                  .find(".register-oiva")
                  .click(function () {
                      var loginUrl = me.conf["registerUrlOiva"];
                      window.location.href = loginUrl;
                  });
                  loginContainer
                  .find(".register-ida")
                  .click(function () {
                      var loginUrl = me.conf["registerUrlIda"];
                      window.location.href = loginUrl;
                  });
                  bodyContainer.append(loginContainer);

                  content.append(header);
                  content.append(bodyContainer);
                  content.append(footer);
                  return content;
                }
              },
              {
                setScope : function(inst) {
                  this.ref = inst;
                },
                getTitle : function() {
                  return this.ref._localization.page2.title;
                },
                getContent : function(dialog, overlay, me) {
                  var content = jQuery('<div></div>');
                  var header = jQuery(this.ref.templates.page2Header);
                  var footer = jQuery(this.ref.templates.footer);

                  var bodyContainer = jQuery('<div class="bodyContainer"></div>');
                  
                  bodyContainer.append('<p>' + this.ref._localization.page2.message + '</p>');

                  bodyContainer.append(jQuery(this.ref.templates.buttons));

                  bodyContainer
                      .find("#submit")
                      .click(
                          function() {
                              if (!me.sandbox.getUser().isLoggedIn()) {
                                  dialog.close(true);
                                  overlay.close();
                                  me.sandbox.postRequestByName('liiteri-announcements.ShowAnnouncementsRequest');
                              } else {
                                  jQuery.ajax({
                                      type: "GET",
                                      dataType: 'json',
                                      beforeSend: function (x) {
                                          if (x && x.overrideMimeType) {
                                              x.overrideMimeType("application/j-son;charset=UTF-8");
                                          }
                                      },
                                      url: me.sandbox.getAjaxUrl() + "action_route=AcceptTos",
                                      success: function (pResp) {
                                          if(pResp && pResp.status === "ok") {
                                              dialog.close(true);
                                              overlay.close();
                                          } else {
                                              me.showMessage(me._localization.errorTitle, me._localization.tosErrorMessage);
                                          }
                                      },
                                      error: function (jqXHR, textStatus) {
                                          me.showMessage(me._localization.errorTitle, me._localization.tosErrorMessage);
                                      }
                                  });
                              }
                          });
                  
                  content.append(header);
                  content.append(bodyContainer);
                  content.append(footer);

                  return content;
                } // ,
              // getPositionRef : function () {
              // var loc = this.ref._localization('page2');
              // var tt = "'" + loc.tileText + "'";
              // var sel = "div.oskari-tile-title:contains(" + tt
              // + ")";
              // return jQuery(sel);
              // },
              // positionAlign : 'right',
              }, {
                setScope : function(inst) {
                  this.ref = inst;
                },
                getTitle : function() {
                  var p3 = this.ref._localization['page3'].title;
                  return p3 + '<span>2/8</span>';
                },
                getContent : function() {
                  var me = this.ref;
                  me._openExtension('LayerSelector');
                  var loc = me._localization['page3'];
                  var content = jQuery('<div></div>');
                  content.append(loc.message);
                  var linkTemplate = jQuery('<a href="#"></a>');
                  var openLink = linkTemplate.clone();
                  openLink.append(loc.openLink);
                  openLink.bind('click', function() {
                    me._openExtension('LayerSelector');
                    openLink.hide();
                    closeLink.show();
                  });
                  var closeLink = linkTemplate.clone();
                  closeLink.append(loc.closeLink);
                  closeLink.bind('click', function() {
                    me._closeExtension('LayerSelector');
                    openLink.show();
                    closeLink.hide();
                  });
                  content.append('<br><br>');
                  content.append(openLink);
                  content.append(closeLink);
                  closeLink.show();
                  openLink.hide();
                  return content;
                } // ,
              // getPositionRef : function () {
              // var loc = this.ref._localization('page3');
              // var sel =
              // return jQuery("div.oskari-tile-title:contains('"
              // +
              // loc.tileText + "')");
              // },
              // positionAlign : 'right'
              }, {
                setScope : function(inst) {
                  this.ref = inst;
                },
                getTitle : function() {
                  var p4 = this.ref._localization['page4'].title;
                  return p4 + '<span>3/8</span>';
                },
                getContent : function() {
                  var me = this.ref;
                  me._openExtension('LayerSelection');
                  var loc = me._localization['page4'];
                  var content = jQuery('<div></div>');
                  content.append(loc.message);
                  var linkTemplate = jQuery('<a href="#"></a>');
                  var openLink = linkTemplate.clone();
                  openLink.append(loc.openLink);
                  openLink.bind('click', function() {
                    me._openExtension('LayerSelection');
                    openLink.hide();
                    closeLink.show();
                  });
                  var closeLink = linkTemplate.clone();
                  closeLink.append(loc.closeLink);
                  closeLink.bind('click', function() {
                    me._closeExtension('LayerSelection');
                    openLink.show();
                    closeLink.hide();
                  });
                  content.append('<br><br>');
                  content.append(openLink);
                  content.append(closeLink);
                  closeLink.show();
                  openLink.hide();
                  return content;
                } // ,
              // getPositionRef : function () {
              // var loc = this.ref._localization('page4');
              // return jQuery("div.oskari-tile-title:contains('"
              // +
              // loc.tileText + "')");
              // },
              // positionAlign : 'right'*/
              }, {
                setScope : function(inst) {
                  this.ref = inst;
                },
                getTitle : function() {
                  var p5 = this.ref._localization['page5'].title;
                  return p5 + '<span>4/8</span>';
                },
                getContent : function() {
                  var me = this.ref;
                  me._openExtension('PersonalData');
                  var loc = me._localization['page5'];
                  var content = jQuery('<div></div>');
                  content.append(loc.message);
                  var linkTemplate = jQuery('<a href="#"></a>');
                  var openLink = linkTemplate.clone();
                  openLink.append(loc.openLink);
                  openLink.bind('click', function() {
                    me._openExtension('PersonalData');
                    openLink.hide();
                    closeLink.show();
                  });
                  var closeLink = linkTemplate.clone();
                  closeLink.append(loc.closeLink);
                  closeLink.bind('click', function() {
                    me._closeExtension('PersonalData');
                    openLink.show();
                    closeLink.hide();
                  });
                  content.append('<br><br>');
                  content.append(openLink);
                  content.append(closeLink);
                  closeLink.show();
                  openLink.hide();
                  return content;
                } // ,
              // getPositionRef : function () {
              // var loc = this.ref._localization('page5');
              // return jQuery("div.oskari-tile-title:contains('"
              // +
              // loc.tileText + "')");
              // },
              // positionAlign : 'right'
              }, {
                setScope : function(inst) {
                  this.ref = inst;
                },
                getTitle : function() {
                  var p6 = this.ref._localization['page6'].title;
                  return p6 + '<span>5/8</span>';
                },
                getContent : function() {
                  var me = this.ref;
                  me._openExtension('Publisher');
                  var loc = me._localization['page6'];
                  var content = jQuery('<div></div>');
                  content.append(loc.message);
                  var linkTemplate = jQuery('<a href="#"></a>');
                  var openLink = linkTemplate.clone();
                  openLink.append(loc.openLink);
                  openLink.bind('click', function() {
                    me._openExtension('Publisher');
                    openLink.hide();
                    closeLink.show();
                  });
                  var closeLink = linkTemplate.clone();
                  closeLink.append(loc.closeLink);
                  closeLink.bind('click', function() {
                    me._closeExtension('Publisher');
                    openLink.show();
                    closeLink.hide();
                  });
                  content.append('<br><br>');
                  content.append(openLink);
                  content.append(closeLink);
                  closeLink.show();
                  openLink.hide();
                  return content;
                } // ),
              // getPositionRef : function () {
              // var loc = this.ref._localization('page6');
              // return jQuery("div.oskari-tile-title:contains('"
              // +
              // loc.tileText + "')");
              // },
              // positionAlign : 'right'*/
              }, {
                setScope : function(inst) {
                  this.ref = inst;
                },
                getTitle : function() {
                  var p7 = this.ref._localization['page7'].title;
                  return p7 + '<span>6/8</span>';
                },
                getContent : function() {
                  var me = this.ref;
                  me._closeExtension('Publisher');
                  var loc = me._localization['page7'];
                  var content = jQuery('<div></div>');
                  content.append(loc.message);
                  return content;
                },
                getPositionRef : function() {
                  return jQuery("#toolbar");
                },
                positionAlign : 'right'

              }, {
                setScope : function(inst) {
                  this.ref = inst;
                },
                getTitle : function() {
                  var p8 = this.ref._localization['page8'].title;
                  return p8 + '<span>7/8</span>';
                },
                getContent : function() {
                  var me = this.ref;
                  var loc = me._localization['page8'];
                  var content = jQuery('<div></div>');
                  content.append(loc.message);
                  return content;
                },
                getPositionRef : function() {
                  return jQuery(".panbuttonDiv");
                },
                positionAlign : 'left'

              }, {
                appendTourSeenCheckbox : true,

                setScope : function(inst) {
                  this.ref = inst;
                },
                getTitle : function() {
                  var p9 = this.ref._localization['page9'].title;
                  return p9 + '<span>8/8</span>';
                },
                getContent : function() {
                  var me = this.ref;
                  var loc = me._localization['page9'];
                  var content = jQuery('<div></div>');
                  content.append(loc.message);
                  return content;
                },
                getPositionRef : function() {
                  return jQuery(".pzbDiv");
                },
                positionAlign : 'left'
              } ],

          _showGuideContentForStep : function(stepIndex, dialog, overlay, me) {
            var step = this._guideSteps[stepIndex];
            step.setScope(this);
            var buttons = this._getDialogButton(dialog);
            var title = step.getTitle();
            var content = step.getContent(dialog, overlay, me);
            if (step.appendTourSeenCheckbox) {
              content.append('<br><br>');
              var checkboxTemplate = jQuery('<input type="checkbox" '
                  + 'name="pti_tour_seen" ' + 'id="pti_tour_seen" '
                  + 'value="1">');
              var checkbox = checkboxTemplate.clone();
              var labelTemplate = jQuery('<label for="pti_tour_seen"></label>');
              var label = labelTemplate.clone();
              label.append(this._localization['tourseen'].label);
              checkbox.bind('change', function() {
                if (jQuery(this).prop('checked')) {
                  // Set cookie not to show guided tour again
                  jQuery.cookie("pti_tour_seen", "1", {
                    expires : 365
                  });
                } else {
                  // Revert to show guided tour on startup
                  jQuery.cookie("pti_tour_seen", "0", {
                    expires : 1
                  });
                }
              });
              content.append(checkbox);
              content.append('&nbsp;');
              content.append(label);
            }

            if (stepIndex != 0  || (stepIndex == 0 && jQuery.cookie('guest_login') != 1)) {        
              overlay.overlay('body');
              dialog.show(null, content, buttons);
            }
            if (step.getPositionRef) {
              dialog.moveTo(step.getPositionRef(), step.positionAlign);
            } else {
              dialog.resetPosition();
            }
          },
          _getFakeExtension : function(name) {
            return {
              getName : function() {
                return name;
              }
            };
          },
          _openExtension : function(name) {
            var extension = this._getFakeExtension(name);
            var rn = 'userinterface.UpdateExtensionRequest';
            this.sandbox.postRequestByName(rn, [ extension, 'attach' ]);
          },
          _closeExtension : function(name) {
            var extension = this._getFakeExtension(name);
            var rn = 'userinterface.UpdateExtensionRequest';
            this.sandbox.postRequestByName(rn, [ extension, 'close' ]);
          },
          _getDialogButton : function(dialog) {
            var me = this, buttons = [], bn, closeTxt = me._localization['button']['close'];

            if (this.guideStep > 1) {
              var closeBtn = dialog.createCloseButton(closeTxt);
              buttons.push(closeBtn);

              bn = 'Oskari.userinterface.component.Button';
              var prevBtn = Oskari.clazz.create(bn);
              var prevTxt = me._localization['button']['previous'];
              prevBtn.setTitle(prevTxt);
              prevBtn.setHandler(function() {
                me.guideStep--;
                me._showGuideContentForStep(me.guideStep, dialog);
              });
              buttons.push(prevBtn);
            }

            if (this.guideStep === 0) {
              bn = 'Oskari.userinterface.component.Button';
              var startBtn = Oskari.clazz.create(bn);
              var startTxt = me._localization['button']['start'];
              startBtn.setTitle(startTxt);
              startBtn.setHandler(function() {
                me.guideStep++;
                me._showGuideContentForStep(me.guideStep, dialog);
              });
              buttons.push(startBtn);
            }
            // check this._guideSteps.length <>
            // this.guideStep and return next or finish?
            else if (this.guideStep < this._guideSteps.length - 1) {
              bn = 'Oskari.userinterface.component.Button';
              var nextBtn = Oskari.clazz.create(bn);
              var nextTxt = me._localization['button']['next'];
              nextBtn.setTitle(nextTxt);
              nextBtn.setHandler(function() {
                me.guideStep++;
                me._showGuideContentForStep(me.guideStep, dialog);
              });
              buttons.push(nextBtn);
            } else if (this.guideStep === this._guideSteps.length - 1) {
              var finishTxt = me._localization['button']['finish'];
              var finishBtn = dialog.createCloseButton(finishTxt);
              buttons.push(finishBtn);
            }
            return buttons;
          },
          /**
           * @method init Module protocol method
           */
          init : function() {
            // headless module so nothing to return
            return null;
          },

          /**
           * @method onEvent Module protocol method/Event dispatch
           */
          onEvent : function(event) {
            var me = this;
            var handler = me.eventHandlers[event.getName()];
            if (!handler) {
              var ret = handler.apply(this, [ event ]);
              if (ret) {
                return ret;
              }
            }
            return null;
          },

          /**
           * @static
           * @property eventHandlers Best practices: defining which events
           *           bundle is listening and how bundle reacts to them
           */
          eventHandlers : {
			'liiteri-groupings.GroupingUpdatedEvent': function (event) {
				//TODO refresh list with service packages
				_startGuide(this.guideStep);
			}
          },

          /**
           * @method stop BundleInstance protocol method
           */
          stop : function() {
            var me = this;
            var sandbox = me.sandbox();
            // unregister module from sandbox
            me.sandbox.unregister(me);
          }
        }, {
          protocol : [ 'Oskari.bundle.BundleInstance',
              'Oskari.mapframework.module.Module' ]
        });