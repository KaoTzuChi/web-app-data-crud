"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from app import views
from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from app import api_views
'''
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from django.conf.urls import url, include
'''

router = DefaultRouter()

urlpatterns = [
    path('', views.index, name='index'),
    path('admin/', admin.site.urls), 
    url(r'^api/', include(router.urls)),   
    url(r'^read_mycollection_all/$', api_views.read_mycollection_all),
    url(r'^read_mycollection_byid/(?P<id>[-\w]+)/$', api_views.read_mycollection_byid),
    url(r'^create_doc_in_mycollection_return_newone/$', api_views.create_doc_in_mycollection_return_newone),
    url(r'^replace_doc_in_mycollection_return_newone/$', api_views.replace_doc_in_mycollection_return_newone),
    url(r'^delete_doc_in_mycollection_return_count/$', api_views.delete_doc_in_mycollection_return_count),
]