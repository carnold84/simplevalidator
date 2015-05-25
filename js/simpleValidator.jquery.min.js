(function ($) {
    
    $.fn.simpleValidator = function (options) {

        'use strict';
        
        // set the default options.
        var settings = $.extend ({
            'blankMessage': 'Please fill in field.',
            'emailMessage': 'Please enter a valid email address.',
            'blankSelectMessage': 'Please select an option.',
            'blankCheckboxMessage': 'This checkbox is required.',
            'blankFileMessage': 'Please select a file.',
            'onSuccess': undefined // callback executed on success
        }, options),
        
        MESSAGES = {
            BLANK : settings.blankMessage,
            EMAIL : settings.emailMessage,
            BLANK_SELECT : settings.blankSelectMessage,
            BLANK_CHECKBOX : settings.blankCheckboxMessage,
            BLANK_FILE : settings.blankFileMessage,
        }, // store settings messages as constants

        onSuccessCallback = settings.onSuccess, // store settings
        elRoot = $(this), // store the form that the validator is applied to.
        elementType = elRoot.prop('tagName').toLowerCase(), // get root element tagName and convert to lowercase
        onSubmitHandler; // function called on submit

        function init () {

            // if the root element is not a form then print message and stop rest
            // of the function
            if (elementType !== 'form') {

                trace('Simple Validator must be applied to a form element.');

                return false;
            }
            
            // bind a listener for on form submit
            elRoot.on('submit', onSubmitHandler);
        }

        // handles form submission
        onSubmitHandler = function (e) {

            e.preventDefault();
                
            // variable stores whether there is an error
            var is_error = false,
                target,
                target_type,
                error_msg,
                target_val,
                validate_string,
                validate_types,
                id,
                html,
                next_element,
                next_element_type,
                blank_message = MESSAGES.BLANK; // default blank message

    
            // remove any errors currently being displayed
            $('.error_msg').remove();
                
            // remove any errors classes
            $('.error').removeClass('error');
            
            // loop through any element with a 'data-validate' attribute
            elRoot.find('[data-validate]').each(function(index, element) {
        
                // store the current element
                target = $(element);
        
                // store the current element type
                target_type = target.prop('tagName').toLowerCase();
                
                // if target's type 'input' then get set it's 'type' attr as target_type
                if(target_type === 'input') {
                    target_type = target.attr('type');   
                }
                
                // string to store the error message
                error_msg = '';
                
                // store input value
                target_val = target.val();
                
                // set message depending on the input type
                if (target_type === 'select') {

                    blank_message = MESSAGES.BLANK_SELECT;

                } else if (target_type === 'checkbox') {

                    blank_message = MESSAGES.BLANK_CHECKBOX;

                } else if (target_type === 'file') {

                    blank_message = MESSAGES.BLANK_FILE;
                }
                
                // store the value from 'data-validate' attribute as an array
                validate_string = $(this).data('validate').replace(/\s+/g, ' ');
                validate_types = validate_string.split(' ');
                
                // loop through array of validation types
                $.each(validate_types, function (index, value) {

                    switch (value) {

                        case 'blank':

                            if (blank(target) === false) {
                                is_error = true;
                                error_msg += '<li>' + blank_message + '</li>';
                            }
                            break;
                        
                        case 'email':

                            if (email(target_val) === false) {
                                is_error = true;
                                error_msg += '<li>' + MESSAGES.EMAIL + '</li>';
                            }
                            break;

                        default :
                            // ignore
                            break;
                    }
                });
                
                // if there's an error then create error DOM element and list of errors
                if (is_error === true && error_msg !== '') {
                    
                    // add error class to the element
                    $(this).addClass('error');
                    
                    // create unique id for each error message by getting
                    // the ID of the target form, adding '_error' and the
                    // current index of the item
                    id = $(this).attr('id') + '_error' + index;
                    
                    // Create the error message html to insert
                    html = '<div id="' + id + '" class="error_msg">';
                    html +=     '<ul>';
                    html +=         error_msg;
                    html +=     '</ul>';
                    html += '</div>';
                    
                    // store the element directly after target element
                    next_element = target.next();
                    
                    // store the next element type
                    next_element_type = next_element.prop('tagName').toLowerCase();
                    
                    // if the next element is a label then...
                    if (target_type === 'checkbox' && next_element_type === 'label' || target_type === 'radio' && next_element_type === 'label') {

                        // ...add error message div after the label element
                        next_element.after(html);

                    } else {

                        // ...add error message div after the target element
                        target.after(html);
                    }
                }
            });
                    
            // if is_error is set to true, cancel form submission and display
            // error messages
            if (is_error === true) {

                return false;
            }
            
            // execute a success if it's defined. This is so it can be used for 
            // forms used just by Javascript (i.e. Ajax or LocalStorage)
            if (onSuccessCallback !== undefined) {

                onSuccessCallback();
                return false;

            } else {

                return true;
            }
        };

        // initialise
        init();
    };
    
    // helper function to check if element value is blank
    function blank (element) {

        var is_blank = true,
            type = element.prop('tagName').toLowerCase(); // Store the current element type
        
        // if target is an input then store it's type
        if (type === 'input') {
            type = element.attr('type');
        }
        
        if (type === 'text' || type === 'password' || type === 'select' || type === 'textarea') {
            
            if(element.val() === '') {

                is_blank = false;
            }

        } else if (type === 'checkbox') {

            if (element.is(':checked') === false) {
                is_blank = false;
            }
        }
        
        return is_blank;
    }
    
    // helper function to check if value is a valid email address
    function email (val) {

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(val);
    }
    
    // function addresses browsers that do not have a console
    // by checking console exists and using an alert if it doesn't
    function trace (msg) {

        if('console' in window) {

            console.log(msg);

        } else {

            alert(msg); 
        }
    }
    
}(jQuery));