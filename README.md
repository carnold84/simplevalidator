# Simple Validator

Simple jQuery validation plugin. Attach to a form and, on form submit, any fields within the form containing the data attribute 'validate' (data-validate) will be validated.

To validate a field simply add data-validate="blank". To use 2 types of validation simply separate them with spaces. i.e. data-validate="blank email".

Currently supported validation:
* blank (checks if field is blank)
* email (checks if field contains a valid email)

Currently supported fields:
* input[type="text"]
* input[type="checkbox"]
* textarea
* select

Todo:
* input[type="file"]
* input[type="radio"]
* remove required from email