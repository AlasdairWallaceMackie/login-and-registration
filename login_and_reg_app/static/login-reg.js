console.log("Script linked")

$(document).ready(function(){
    console.log("Document ready")
    console.log("Current pathname: " + window.location.pathname)
    $('.error_row').attr('active', 'false')

    $('input').focusout(function(e){
        id = this.id
        validate(id)
    });

    function validate(id){
        if (id == "")
            return false

        id = '#' + id
        var value = $(id).val();
        var errorMessage = "";
        console.log(`Validating ${id}`)

        switch(id){
            case '#first_name':
            case '#last_name':
                re = /[A-Za-z\'\s.]{2,32}/
                if (re.test(value) == false)
                    errorMessage = "Must be between 2 and 32 valid characters"
                break;

            case '#login_email':
            case '#email':
                re = /[A-Za-z0-9.-_+]+@[A-Za-z0-9.-_+]+\.[A-Za-z0-9]+/gm;
                if (re.test(value) == false)
                    errorMessage = "Invalid email"
                break;

            case '#birthday':
                console.log("Birthday:" + value)
                if(value == "")
                    errorMessage = "Please enter a birthday"
                else if( age(value) < 13 )
                    errorMessage = "Must be at least 13 years old"
                break;

            case '#password':
                if (value.length < 8)
                    errorMessage = "Password must be at least 8 characters"
                break;

            case '#confirm':
                if (value != $('#password').val())
                    errorMessage = "No match"
                break;

            case '#login_password':
                if (value.length < 1)
                    errorMessage = "Please enter a password"
                break;
        }
        
        if (errorMessage != ""){
            console.log("Error message: " + errorMessage)
            $(id).css("background-color", "lightcoral");

            if ($(id).parent().parent().next('tr').children('.error_row').attr("active") == 'false'){
                $(id).parent().parent().next('tr').children('.error_row').append(`<span class="error">${errorMessage}</span>`).attr("active", 'true');
            }
            return 1;
        }
        else{
            console.log("No validation issues found")
            $(id).css("background-color", "white");
            $(id).parent().parent().next('tr').children('.error_row').attr("active", 'false').children().remove()
            return 0;
        }

    }
    
function age(birthday){
    var birthdayObject = new Date(birthday)
    var difference = Date.now() - birthdayObject.getTime();
    var ageDate = new Date(difference)
    var year = ageDate.getUTCFullYear();
    var age = Math.abs(year - 1970)
    return age;
    }

    $('form').submit(function(){
        console.log("Form submit clicked")
        var errors = 0
        var form_id = "#" + $(this).attr('id')
        current_form = this

        if (form_id == "#registration")
            submitUrl = "/users/create"
        else if (form_id == "#login")
            submitUrl = "/login"
        else
            return true;
        
        $(form_id).find('input').each(function(){
            // console.log(".each ID: " + $(this).attr('id'))
            errors += validate($(this).attr('id'));
        });
        
        console.log(`There are ${errors} errors`)
        if (errors == 0){
            $.post( submitUrl, $(form_id).serialize(), function(){
                if (window.location.pathname == '/')
                    window.location.replace("/success")
            });
        }
        
        return false;
    });

    if(window.location.pathname == "/success"){
        console.log("Now in SUCCESS template");
        window.setTimeout(function(){
            console.log("Redirecting");
            window.location.href = "main";
        }, 5000);
    }
    


    // $.get('/users/emails', function(data){
    //     errorMessage = ""
    //     console.log("****************************")
    //     console.log("Checking for duplicate email")
    //     var emails = data['emails']

    //     for(var i=0; i<emails.length; i++){
    //         console.log("Data: " + emails[i]);
    //         if (value == emails[i]){
    //             console.log("Duplicate found!")
    //             errorMessage = "This email is already in use"
    //         }
    //     }
    //     console.log("Final message: " + errorMessage)
    //     duplicate_email = true
    // });



});