// Categorize colours in the category they belong to
var tshirtDesignArray = {
    'js puns': ['cornflowerblue', 'darkslategrey', 'gold'],
    'heart js': ['tomato', 'steelblue', 'dimgrey'],
};

// Link activities that happen at the same time
var activitiesArray = {
    'js-libs': 'node',
    'node': 'js-libs',
    'js-frameworks': 'express',
    'express': 'js-frameworks'
};

// Price for each activity
var activitiesPrices = {
    "all": 200,
    "js-frameworks": 100,
    "js-libs": 100,
    "express": 100,
    "node": 100,
    "build-tools": 100,
    "npm": 100
};

$(document).ready(function(){
    // Hide elements that need to be hidden before the user uses the form
    $('#error-messages').hide();
    $('#name').focus();
    $('.other-title').hide();
    $('#payment').val('credit card');
    $('#paypal').hide();
    $('#bitcoin').hide();
    $('#color').hide();
    $('label[for="color"]').hide();

    /**
     * When value changes for the title, if the value is other
     * show the text box to enter value for other title
     */
    $('#title').on('change', function(e) {
        if (this.value == 'other') {
            $('.other-title').show();
        } else {
            $('.other-title').hide();
        }
    });

    $('#design').on('change', function(){
        // The value of the design selected
        var design = this.value;
        // Clear all options of being the selected choice
        $('#color').children('option').removeAttr('selected');
        // Continue if a design was selected
        if (design != 'Select Theme') {
            // Show the color options, and hide all the children
            $('#color').show();
            $('label[for="color"]').show();
            $('#color').children('option').hide();
            $('#color').children('option').removeAttr('selected');
            var colors = tshirtDesignArray[design];
            /**
             * For each colors for a particular design, show it
             * Also make the first colour in the design array by default
             * the selected value
             */
            $.each(colors, function(index, value) {
                $('#color').children("option[value=" + value + "]").show();
                if (index === 0) {
                    $('#color').children("option[value=" + value + "]").attr('selected', 'selected');
                }
            });
        } else {
            // Hide colour options if no design was selected
            $('#color').hide();
            $('label[for="color"]').hide();
        }
    });

    $('input[type="checkbox"]').on('click', function() {
        // Remove the text on the total amount chosen
        $('#activities-total').remove();
        var totalAmount = 0;
        /**
         * Go through each checkbox in the form. If its checked, then add the
         * value to the totalAmount value
         */
        $.each($('input[type="checkbox"]'), function(index, value) {
            $el = $(this);
            if ($el.is(":checked")) {
                // If the activity selected is on at the same time as another activity
                // Then disabled that activity
                if (activitiesArray.hasOwnProperty($el.attr('name'))) {
                    $('input[name="' + activitiesArray[$el.attr('name')] + '"]').attr('disabled', true);
                }
                //Calculate total
                totalAmount += activitiesPrices[$el.attr('name')];
            } else {
                // If the activity selected is on at the same time as another activity
                // Then enable that activity
                if (activitiesArray.hasOwnProperty($el.attr('name'))) {
                    $('input[name="' + activitiesArray[$el.attr('name')] + '"]').removeAttr('disabled');
                }
            }
        });
        // If the totalamount is more than $0, then show text the total amount
        if (totalAmount > 0) {
            $('.activities').append('<label id="activities-total">Total: $' + totalAmount + '</label>');
        }
    });

    /**
     * Hide and show payment options based on what payment option was selected
     */
    $('#payment').on('change', function(){
        $('#credit-card').show();
        $('#paypal').show();
        $('#bitcoin').show();
        if (this.value == 'credit card') {
            $('#paypal').hide();
            $('#bitcoin').hide();
        } else if (this.value == 'paypal') {
            $('#bitcoin').hide();
            $('#credit-card').hide();
        } else if (this.value == 'bitcoin') {
            $('#paypal').hide();
            $('#credit-card').hide();
        }
    });
});

/**
 * When form is submitted, check the necessary fields are filled in correctly
 * otherwise return false with an error messages
 * Scroll to the top of the form if validation fails
 * @returns {boolean}
 */
function validateForm() {
    if ($('#name').val() === '') {
        $('#error-messages').html('Please enter a name');
        $('#error-messages').show();
        $(window).scrollTop(0);
        return false;
    }
    if ($('#mail').val() === '') {
        $('#error-messages').html('Please enter a email');
        $('#error-messages').show();
        $(window).scrollTop(0);
        return false;
    }
    var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!regex.test($('#mail').val())) {
        $('#error-messages').html('Please enter a valid email');
        $('#error-messages').show();
        $(window).scrollTop(0);
        return false;
    }
    if ($('input[type=checkbox]:checked').length === 0) {
        $('#error-messages').html('Please select at least one activity');
        $('#error-messages').show();
        $(window).scrollTop(0);
        return false;
    }
    if ($('#payment').val() == 'select_method') {
        $('#error-messages').html('Please select a payment method');
        $('#error-messages').show();
        $(window).scrollTop(0);
        return false;
    }
    if ($('#payment').val() == 'credit card' &&
        ($('#cc-num').val() === '' || $('#zip').val() === '' || $('#cvv').val() === '' )) {
        $('#error-messages').html('Please fill in details for card number, zip code and CVV.');
        $('#error-messages').show();
        $(window).scrollTop(0);
        return false;
    }
    if ($('#payment').val() == 'credit card' && !valid_credit_card($('#cc-num').val())) {
        $('#error-messages').html('Please enter a valid credit card number.');
        $('#error-messages').show();
        $(window).scrollTop(0);
        return false;
    }
    return true;
}

/**
 * Function borrowed from https://gist.github.com/DiegoSalazar/4075533
 * @param value
 * @returns {boolean}
 */
function valid_credit_card(value) {
    // accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)) return false;

    // The Luhn Algorithm. It's so pretty.
    var nCheck = 0, nDigit = 0, bEven = false;
    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n),
            nDigit = parseInt(cDigit, 10);

        if (bEven) {
            if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
    }

    return (nCheck % 10) == 0;
}