from django.urls import path
from . import views

urlpatterns = [ 
    path('', views.index),
    path('users/create', views.create_user),
    path('login', views.login_user),
    path('success', views.success),
    path('logout', views.logout_user),
    path('main', views.redirect_placeholder),
    path('debug', views.debug),
]