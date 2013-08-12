(function ( $ ) {
	
	$.fn.simpleValidator = function( options ) {
		
		// Set the default options.
        var settings = $.extend({
			'blankMessage': 'Please fill in field.',
			'emailMessage': 'Please enter a valid email address.',
			'blankSelectMessage': 'Please select an option.',
			'blankCheckboxMessage': 'This checkbox is required.',
			'onSuccess': undefined
        }, options );
		
		// Store settings
		var blankMessage = settings.blankMessage, 
			emailMessage = settings.emailMessage,
			blankSelectMessage = settings.blankSelectMessage,
			blankCheckboxMessage = settings.blankCheckboxMessage,
			onSuccess = settings.onSuccess;
		
		// Store the form that the validator is applied to.
		var rootElement = $(this);
		
		// Get root element tagName and convert to lowercase
		var elementType = rootElement.prop('tagName').toLowerCase();
		// If the root element is not a form then print message and stop rest
		// of the function
		if(elementType != 'form') {
			trace('Simple Validator must be applied to a form element.');
			return false;
		}
		
		// Bind a listener for on form submit
		$(this).bind('submit', function(e) {
			
			e.preventDefault();
				
			// Variable stores whether there is an error
			var isError = false;
	
			// Remove any errors currently being displayed
			$('.error_msg').remove();
				
			// Remove any errors classes
			$('.error').removeClass('error');
			
			// Loop through any element with a 'data-validate' attribute
			$(this).find('[data-validate]').each(function(index, element) {
		
				// Store the current element
				var target = $(element);
		
				// Store the current element type
				var targetType = target.prop('tagName').toLowerCase();
				
				// If target's type 'input' then get set it's 'type' attr as targetType
				if(targetType == 'input') {
					targetType = target.attr('type');	
				}
				
				// String to store the error message
				var errorMsg = '';
				
				// Store input value
				var targetVal = target.val();
				
				if(targetType == 'select') {
					blankMessage = blankSelectMessage;
				} else if(targetType == 'checkbox') {
					blankMessage = blankCheckboxMessage;
				}
				
				// Store the value from 'data-validate' attribute as an array
				var validateString = $(this).data('validate').replace(/\s+/g, '');
				var	validateTypes = validateString.split(',');
				
				// Loop through array of validation types
				$.each(validateTypes, function(index, value) {
					switch(value) {
						case 'blank':
							if(blank(target) == false) {
								isError = true;
								errorMsg += '<li>' + blankMessage + '</li>';	
							}
						break;
						
						case 'email':
							if(email(targetVal) == false) {
								isError = true;
								errorMsg += '<li>' + emailMessage + '</li>';	
							}
						break;
					}
				});
				
				if(isError == true && errorMsg != '') {
					
					// Add error class to the element
					$(this).addClass('error');
					
					// Create unique id for each error message by getting
					// the ID of the target form, adding '_error' and the
					// current index of the item
					var id = rootElement.attr('id') + '_error' + index;
					
					// Create the error message html to insert
					var html = '<div id="' + id + '" class="error_msg">';
						html += 	'<ul>';
						html += 		errorMsg;
						html +=		'</ul>';
						html += '</div>';
					
					// Store the element directly after target element
					var nextElement = target.next();
					
					// Store the next element type
					var nextElementType = nextElement.prop('tagName').toLowerCase();
					
					// If the next element is a label then...
					if(targetType == 'checkbox' && nextElementType == 'label' || targetType == 'radio' && nextElementType == 'label') {
						// ...add error message div after the label element
						nextElement.after(html);
					} else {
						// ...add error message div after the target element
						target.after(html);
					}
				}
			});
					
			// If isError is set to true, cancel form submission and display
			// error messages
			if(isError == true) {
				return false;
			}
			
			if(onSuccess != undefined) {
				onSuccess();
				return false;	
			}
		});
	
	}
	
	function blank(element) {
		var isBlank = true;
		
		// Store the current element type
		var type = element.prop('tagName').toLowerCase();
		
		// If target's type 'input' then get set it's 'type' attr as targetType
		if(type == 'input') {
			type = element.attr('type');	
		}
		
		if(type == 'text' || type == 'password' || type == 'select' || type == 'textarea') {
			if(element.val() == '') {
				isBlank = false;	
			}
		} else if(type == 'checkbox') {
			trace(element.is(':checked'));
			if(element.is(':checked') == false) {
				isBlank = false;
			}
		}
		
		return isBlank;
	}
	
	function email(val) { 
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(val);
	}
	
	// Function addresses browsers that do not have a console
	// by checking console exists and using an alert if it doesn't
	function trace(msg) {
		if('console' in window) {
			console.log(msg);	
		} else {
			alert(msg);	
		}
	}
	
}( jQuery ));