from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from .models import *
from django.contrib import messages
import bcrypt

def index(request):
    context = {}
    try:
        current_user = User.objects.get( id = request.session['current_user_id'] )
        context = {
            'current_user': current_user,
        }
    except:
        context = {}
        
    return render(request, 'index.html', context)

def create_user(request):
    request.session.clear()

    # ! Only un-comment this for debugging purposes
    # for k,v in request.POST.items():
    #     print(f"{k}: {v}")

    errors = User.objects.basic_validator(request.POST)
    if errors:
        print("Errors found in form")
        for k,v in errors.items():
            messages.error(request, v)
        return redirect('/')

    new_user = User.objects.create(
        first_name = request.POST['first_name'],
        last_name = request.POST['last_name'],
        email = request.POST['email'].lower(),
        # alias = request.POST['alias'],
        # birthday = request.POST['birthday'],
        password = bcrypt.hashpw( request.POST['password'].encode(), bcrypt.gensalt() ).decode()
    )

    request.session['current_user_id'] = new_user.id
    request.session['status'] = "registered" #To determine message on Success page

    return redirect('/success')

def login_user(request):
    try:
        user1 = User.objects.get( email = request.POST['login_email'].lower() )
    except:
        messages.error(request, "Email not found")
        return redirect('/')

    if not bcrypt.checkpw( request.POST['login_password'].encode(), user1.password.encode()):
        print("Incorrect password")
        messages.error(request, "Password is incorrect")
        return redirect('/')
    
    request.session['current_user_id'] = user1.id
    request.session['status'] = "logged in" #To determine message on Success page

    print("************************")
    for k,v in request.session.items():
        print(f"{k}: {v}")

    return redirect('/success')

def logout_user(request):
    request.session.clear()
    return redirect('/')

def success(request):
    if request.session.has_key('current_user_id'):
        context = {
            'current_user': User.objects.get(id = request.session['current_user_id'])
        }
        return render(request, 'success.html', context)
    
    return HttpResponse("""<h2>Error</h2>
        <p>Possible causes:</p>
        <ul>
            <li>You navigated to this page by mistake</li>
            <li>You entered a duplicate email</li>
        </ul>
        <a href="/">Return to home page</a>
    """)



#####
#####
def debug(request):
    context = {
        'all_users': User.objects.all()
    }
    return render(request, 'debug.html', context)

def redirect_placeholder(request):
    return HttpResponse('<h1>Main content here</h1><br><a href="/">Back to login</a>')