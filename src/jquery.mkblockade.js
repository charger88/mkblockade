/*
MKBlockade v1.0.0
Copyright (c) 2015 Mikhail Kelner
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
(function($){
    jQuery.mkBlockade = function(options){
        var options = $.extend({
			requireForOneOnly: true,
			checkScriptLoadingPath: '',
			detectedReportURI: '',
			detectedMessageText: '',
			detectedCallback: function(){},
        }, options);
		var init = function(){
			checkDivElement();
			checkScriptLoading();
			waitForCheckings();
		};
		var checkDivElementResult = undefined;
		var checkDivElement = function(){
			var $tD = $('<div>').addClass('adv').css({
				'position': 'absolute',
				'z-index': '2',
				'top': '50%',
				'left': '50%',
			});
			$('body').append($tD);
			var offset = $tD.offset();
			var result = offset.top || offset.left ? true : false;
			$tD.remove();
			checkDivElementResult = result;
		}
		checkScriptLoadingResult = undefined;
		var checkScriptLoading = function(){
			if (options.checkScriptLoadingPath.length > 0){
				$.ajax(options.checkScriptLoadingPath,{
					error: function(){
						checkScriptLoadingResult = false;
					},
					success: function(){
						checkScriptLoadingResult = true;
					}
				});
			} else {
				checkScriptLoadingResult = options.requireForOneOnly ? false : true;
			}
		}
		var waitForCheckings = function(){
			if ((checkDivElementResult != undefined) && (checkScriptLoadingResult != undefined)){
				console.log('C',checkDivElementResult,checkScriptLoadingResult);
				assessResults(checkDivElementResult,checkScriptLoadingResult);
			} else {
				console.log('W',checkDivElementResult,checkScriptLoadingResult);
				setTimeout(function(){
					waitForCheckings();
				},100);
			}
		}
		var assessResults = function(){
			var isDetected = options.requireForOneOnly ? ( !checkDivElementResult || !checkScriptLoadingResult ) : ( !checkDivElementResult && !checkScriptLoadingResult );
			if (isDetected){
				if (options.detectedReportURI.length > 0){
					var reportImage = document.createElement("img");
					reportImage.setAttribute('src', options.detectedReportURI);
				}
				if (options.detectedMessageText.length > 0){
					alert(options.detectedMessageText);
				}
				options.detectedCallback();
			}
		};
		init();
	};
})(jQuery);