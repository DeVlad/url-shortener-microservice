function shortenUrl(url) {
    var url = window.location.origin + '/api?url=' + url;

    $.ajax({
        url: url,
        type: 'POST',
        success: function (result) {
            if (!result.error) {
                var shortenedUrl = result.shortUrl;
                $("#shortened").val(shortenedUrl);
                $("#copy").removeClass("invisible");
                $("#shortened").removeClass("invisible");
            } else {
                $("#shortened").val('Error');
            }
        }
    }, 'json');
}

$("#shorten-form").on("focusin", function () {
    $("#shortened").empty();
    $("#copy").addClass("invisible");
    $("#shortened").addClass("invisible");
});

$("#copy").on("click", function () {
    var short = document.getElementById("shortened");
    short.select();
    document.execCommand("Copy");
});

$(document).ready(function () {
    $.validator.setDefaults({
        submitHandler: function (form) {
            var url = $(form).find('input[name="url"]').val();
            shortenUrl(url);
        }
    });

    $.validator.addMethod("validUrl", function (value, element) {
        var re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        return this.optional(element) || re.test(value);
    });

    $("#shorten-form").on("submit", function (event) {
        event.preventDefault();
    });

    $("#shorten-form").validate({
        rules: {
            url: {
                required: true,
                minlength: 4,
                maxlength: 2000,
                validUrl: true
            }
        },
        messages: {
            url: {
                required: "Please provide a URL",
                minlength: "Your URL must be at least 8 characters long",
                maxlength: "Your URL must be at under 2000 characters long",
                validUrl: "The URL must start with http:// or https:// Please enter a valid url like http://example.com"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            error.addClass("help-block");
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).parents(".col-md-4").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents(".col-md-4").addClass("has-success").removeClass("has-error");
        }
    });
});
