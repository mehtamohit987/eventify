$(document).ready(function () {

    $('#registerForm').validate({
        rules: {
            // fname: {
            //     minlength: 2,
            //     required: true
            // },
            email: {
                //required: true,
                email: true
            },
            rpassword: {
                minlength: 2,
                required: true
            }
        },
        highlight: function (element) {
            $(element).closest('.control-group').removeClass('success').addClass('error');
        },
        success: function (element) {
            element.text('OK!').addClass('valid')
                .closest('.control-group').removeClass('error').addClass('success');
        }
    });

});