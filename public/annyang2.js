//! annyang
//! version : 0.2.0
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://www.TalAter.com/annyang/
(function () {
    "use strict";

    // Save a reference to the global object (window in the browser)
    var root = this;

    // Get the SpeechRecognition object, while handling browser prefixes
    var SpeechRecognition = root.webkitSpeechRecognition ||
                            root.mozSpeechRecognition ||
                            root.msSpeechRecognition ||
                            root.oSpeechRecognition ||
                            root.SpeechRecognition;

    // Check browser support
    // This is done as early as possible, to make it as fast as possible for unsupported browsers
    if (!SpeechRecognition) {
        root.annyang = null;
        return null;
    }

    var commandsList;
    var recognition;
    var lang = 'en-IN';
    callbacks = { start: [], playMusic: [], error: [], end: [], result: [], resultMatch: [], resultNoMatch: [], errorNetwork: [], errorPermissionBlocked: [], errorPermissionDenied: [] };
    var autoRestart;
    var lastStartedAt = 0;
    var debugState = false;
    var debugStyle = 'font-weight: bold; color: #00f;';

    // The command matching code is a modified version of Backbone.Router by Jeremy Ashkenas, under the MIT license.
    var optionalParam = /\s*\((.*?)\)\s*/g;
    var optionalRegex = /(\(\?:[^)]+\))\?/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#]/g;
    var commandToRegExp = function (command) {
        command = command.replace(escapeRegExp, '\\$&')
                      .replace(optionalParam, '(?:$1)?')
                      .replace(namedParam, function (match, optional) {
                          return optional ? match : '([^\\s]+)';
                      })
                      .replace(splatParam, '(.*?)')
                      .replace(optionalRegex, '\\s*$1?\\s*');
        return new RegExp('^' + command + '$', 'i');
    };

    // This method receives an array of callbacks to iterate over, and invokes each of them
    invokeCallbacks = function (callbacks) {
        for (var j = 0, l = callbacks.length; j < l; j++) {
            callbacks[j].callback.apply(callbacks[j].context);
        }
    };

    root.annyang = {
        // Initialize annyang with a list of commands to recognize.
        // e.g. annyang.init({'hello :name': helloFunction})
        // annyang understands commands with named variables, splats, and optional words.
        init: function (commands) {
            
            // Abort previous instances of recognition already running
            if (recognition && recognition.abort) {
                recognition.abort();
            }

            // initiate SpeechRecognition
            recognition = new SpeechRecognition();

            // Set the max number of alternative transcripts to try and match with a command
            recognition.maxAlternatives = 1;
            recognition.interimResults = true;
            recognition.continuous = true;
            // Sets the language to the default 'en-US'. This can be changed with annyang.setLanguage()
            recognition.lang = lang;

            recognition.onstart = function () { invokeCallbacks(callbacks.start); };

            recognition.onerror = function (event) {
                invokeCallbacks(callbacks.error);
                switch (event.error) {
                    case 'network':
                        invokeCallbacks(callbacks.errorNetwork);
                        break;
                    case 'not-allowed':
                    case 'service-not-allowed':
                        // if permission to use the mic is denied, turn off auto-restart
                        autoRestart = false;
                        // determine if permission was denied by user or automatically.
                        if (new Date().getTime() - lastStartedAt < 200) {
                            invokeCallbacks(callbacks.errorPermissionBlocked);
                        } else {
                            invokeCallbacks(callbacks.errorPermissionDenied);
                        }
                        break;
                }
            };

            recognition.onend = function () {
                invokeCallbacks(callbacks.end);
                // annyang will auto restart if it is closed automatically and not by user action.
                if (autoRestart) {
                    // play nicely with the browser, and never restart annyang automatically more than once per second
                    var timeSinceLastStart = new Date().getTime() - lastStartedAt;
                    if (timeSinceLastStart < 1000) {
                        setTimeout(root.annyang.start, 1000 - timeSinceLastStart);
                    } else {
                        root.annyang.start();
                    }
                }
            };

            recognition.onresult = function (event) {
                var interim = '';
                invokeCallbacks(callbacks.result);
                //var results = event.results[event.resultIndex];
                var commandText;
                var final = '';
                // go over each of the 5 results and alternative results received (we've set maxAlternatives to 5 above)
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    interim += event.results[i][0].transcript;
                    // the text recognized
                    commandText = event.results[i][0].transcript;
                    if (debugState) {
                        root.console.log('Speech recognized: %c' + commandText, debugStyle);
                    }
                    //Anubhav
                    if (event.results[i].isFinal) {
                        final = event.results[i][0].transcript;
                        interim = '';
                        interim_span.innerText = '';
                    }
                }
                
                // try and match recognized text to one of the commands on the list
                for (var j = 0, l = commandsList.length; j < l; j++) {
                    var keywords = final.split(' ');
                    var result;
                    var commandIndex = -1;
                    result = commandsList[j].command.exec(final.trim());
                    if (result != null) {
                        var parameters = result.slice(1);
                        //anubhav debug
                        command_span.innerHTML += commandsList[j].originalPhrase + '<br/>';
                        commandIndex = j;
                        if (debugState) {
                            root.console.log('command matched: %c' + commandsList[j].originalPhrase, debugStyle);

                            if (parameters.length) {
                                root.console.log('with parameters', parameters);
                            }
                        }
                        // execute the matched command
                        final_span.innerText += final;
                        commandsList[j].callback.apply(this, parameters);
                        invokeCallbacks(callbacks.resultMatch);
                        return false;
                    }
                    else {
                        $.each(keywords, function (index, value) {
                            result = commandsList[j].command.exec(value);
                            if (result) {
                                var parameters = result.slice(1);
                                //anubhav debug
                                command_span.innerHTML += commandsList[j].originalPhrase + '<br/>';
                                commandIndex = j;
                                if (debugState) {
                                    root.console.log('command matched: %c' + commandsList[j].originalPhrase, debugStyle);

                                    if (parameters.length) {
                                        root.console.log('with parameters', parameters);
                                    }
                                }
                                // execute the matched command
                                if (commandIndex === -1) {
                                    interim_span.innerText = interim;
                                    final_span.innerText += final;
                                    commandsList[j].callback.apply(this, parameters);
                                    invokeCallbacks(callbacks.resultMatch);
                                    return false;
                                }
                            }
                        });
                    }

                }
                //interim_span.innerText = '';
                interim_span.innerText = interim;
                final_span.innerText += final;
                invokeCallbacks(callbacks.resultNoMatch);
                return false;
            };

            // build commands list
            commandsList = [];
            this.addCommands(commands);
        },

        playMusic: function createCommand(textToParse) {
            for (var j = 0, l = commandsList.length; j < l; j++) {
                var keywords = textToParse.split(' ');
                var result;
                var commandIndex = -1;
                $.each(textToParse, function (index, value) {
                    result = commandsList[j].command.exec(value);
                    if (result) {
                        var parameters = result.slice(1);
                        //anubhav debug
                        command_span.innerHTML += commandsList[j].originalPhrase + '<br/>';
                        commandIndex = j;
                        //if (debugState) {
                        //    root.console.log('command matched: %c' + commandsList[j].originalPhrase, debugStyle);

                        //    if (parameters.length) {
                        //        root.console.log('with parameters', parameters);
                        //    }
                        //}
                        // execute the matched command
                        //if (commandIndex === -1) {
                        //    interim_span.innerText = interim;
                        //    final_span.innerText += final;
                        //    commandsList[j].callback.apply(this, parameters);
                        //    invokeCallbacks(callbacks.resultMatch);
                        //    return false;
                        //}
                    }
                });
            }
        },

        // Start listening (asking for permission first, if needed).
        // Call this after you've initialized annyang with commands.
        // Receives an optional options object:
        // { autoRestart: true }
        start: function (options) {
            options = options || {};
            if (options.autoRestart !== void 0) {
                autoRestart = !!options.autoRestart;
            } else {
                autoRestart = true;
            }
            lastStartedAt = new Date().getTime();
            recognition.start();
        },

        // abort the listening session (aka stop)
        abort: function () {
            autoRestart = false;
            recognition.abort();
        },

        // Turn on output of debug messages to the console. Ugly, but super-handy!
        debug: function (newState) {
            if (arguments.length > 0) {
                debugState = !!newState;
            } else {
                debugState = true;
            }
        },

        // Set the language the user will speak in. If not called, defaults to 'en-US'.
        // e.g. 'fr-FR' (French-France), 'es-CR' (Español-Costa Rica)
        setLanguage: function (language) {
            lang = language;
            if (recognition && recognition.abort) {
                recognition.lang = language;
            }
        },

        // Add additional commands that annyang will respond to. Similar in syntax to annyang.init()
        addCommands: function (commands) {
            var cb,
                command;
            for (var phrase in commands) {
                if (commands.hasOwnProperty(phrase)) {
                    cb = root[commands[phrase]] || commands[phrase];
                    if (typeof cb !== 'function') {
                        continue;
                    }
                    //convert command to regex
                    command = commandToRegExp(phrase);

                    commandsList.push({ command: command, callback: cb, originalPhrase: phrase });
                }
            }
            if (debugState) {
                root.console.log('Commands successfully loaded: %c' + commandsList.length, debugStyle);
            }
        },

        // Lets the user add a callback of one of 9 types:
        // start, error, end, result, resultMatch, resultNoMatch, errorNetwork, errorPermissionBlocked, errorPermissionDenied
        // Can also optionally receive a context for the callback function as the third argument
        addCallback: function (type, callback, context) {
            if (callbacks[type] === void 0) {
                return;
            }
            var cb = root[callback] || callback;
            if (typeof cb !== 'function') {
                return;
            }
            callbacks[type].push({ callback: cb, context: context || this });
        }
    };

}).call(this);
