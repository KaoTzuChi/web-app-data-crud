# Web app data CRUD: angular, python(django rest) and mongodb in docker

## Version
- node 12.13.0
- angular/cli 8.3.14
- Python 3.7.4
- django 2.2.3
- djangorestframework 3.10.1
- pymongo 3.8.0
- MongoDB 4.2.0
- Docker 19.03.5
- Ubuntu 18.04.3 LTS

## Getting start
We are going to build a web application of basic data create, read, update and delete operations.
This example is simple three tiers design and uses angular for the frontend, django for the backend and mongodb for the data storage.
We can get the source code of this example [here](https://github.com/KaoTzuChi/web-app-data-crud).

## Database setting
Prepare the image of mongodb in docker first, and then create a container from the image.
After execute the container and enter the mongo shell, build the sample data as below.
```
conn = new Mongo("127.0.0.1:27017");
dbadmin = conn.getDB("admin");
dbadmin.auth( "root", "123456789" );
db = dbadmin.getSiblingDB('mydatabase');
db.createUser({
    "user" : "myuser",
    "pwd" : "myuserspwd",
    "roles" : [{ "db" : "mydatabase", "role": "readWrite" },{ "db" : "mydatabase", "role": "dbOwner" }]
    });
db.createCollection("mycollection", { autoIndexId: true } );
db.mycollection.remove({});
db.mycollection.insertMany([
    { "field1": "valueof-doc1-field1", "field2":{"item1":"valueof-doc1-field2-item1", "item2":"valueof-doc1-field2-item2"}, "field3": new Date("2011-01-01 01:01:01+01:00"), "field4":1.01 },
    { "field1": "valueof-doc2-field1", "field2":{"item1":"valueof-doc2-field2-item1", "item2":"valueof-doc2-field2-item2"}, "field3": new Date("2012-02-02 02:02:02+02:00"), "field4":2.02 },
    { "field1": "valueof-doc3-field1", "field2":{"item1":"valueof-doc3-field2-item1", "item2":"valueof-doc3-field2-item2"}, "field3": new Date("2013-03-03 03:03:03+03:00"), "field4":3.03 }
    ]);
```
The details about mongo shell, please reference [here](https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/).


## Backend app: Django
### Database access tool
Install pymongo by pip, and then insert the connection information into settings.py.
```
MONGO_DATABASE = {
    'name': 'mydatabase',
    'user': 'myuser',
    'password': 'myuserspwd',
    'host': 'mongodb://myuser:myuserspwd@database-service:27017/mydatabase',
    'port': 27017,
    'timeput': 5000,
    'retry': 5,
}
```
For using pymongo, the steps are connecting to the mongo server, logging in the database, getting the collection, and then the CRUD operations in the collection. 
```
# import pymongo and necessary packages
import pymongo
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

# get connection information from settings.py
host = settings.MONGO_DATABASE['host']

# connect to mongodb
connection = MongoClient(host)

# get the built database 
db = connection[ settings.MONGO_DATABASE['name'] ]

# login to the database by username and password
db.authenticate(settings.MONGO_DATABASE['user'], settings.MONGO_DATABASE['password'] )

# get a collection by name
collection = db['mycollection']

# read documents in the collection
# read all without any condiction
cursor = collection.find({})
# find those documents at least having the field "_id"
cursor = collection.find({'_id': {'$exists': True}})
# find a document by the specify id
cursor = collection.find({'_id': ObjectId('5e461002d069ba45a5fbe9da')})  

# insert documents into the collection
document = { 'field1': 'abcd', 'field2':{'item1':'efgh', 'item2':'ijkl', 'field3': new Date('2020-01-01'), 'field4': 1.23 }
result = collection.insert_one(document)
documents = [ doc1, doc2, ... ]
result = collection.insert_many(documents)

# modify documents in the collection
result = collection.replace_one( {'field1': 'abcd'}, {'field1': 'mnop','field4': 4.56 } )
result = collection.update_one({'field1': 'abcd'}, {'$inc': {'field4': 3.00}})
result = collection.update_many({'field1': 'abcd'}, {'$inc': {'field4': 3.00}})

# remove documents in the collection
result = collection.delete_one( {'_id': ObjectId('5e461002d069ba45a5fbe9da')} )
result = collection.delete_many( {'field1': 'abcd'} )
```
More operations and detailed descriptions about pymongo, please reference [here](https://api.mongodb.com/python/current/api/pymongo/index.html).


### Data serializer
Install djangorestframework by pip, and make sure "rest_framework" is inside of "INSTALLED_APPS" in settings.py.
```
INSTALLED_APPS = [
    ...
    'rest_framework',
]
```

Create data models matching the database schema, and then make serializers for those models.
```
class myModel(object):
    def __init__(self, _id, field1, field2, field3, field4):
       self._id =_id
       self.field1 = field1
       self.field2 = field2
       self.field3 = field3
       self.field4 = field4

class mySerializer(serializers.Serializer):
    _id = serializers.CharField(required=False)
    field1 = serializers.CharField(required=False)
    field2 = serializers.DictField(serializers.CharField(required=False, default=''))
    field3 = serializers.DateTimeField(required=False,default=datetime.datetime.now())  
    field4 = serializers.DecimalField(max_digits=3, decimal_places=2, required=False, default=0.00)

    def create(self, attrs, instance=None):
        if instance:
            instance._id = attrs.get('_id', instance._id)
            instance.field1 = attrs.get('field1', instance.field1)
            instance.field2 = attrs.get('field2', instance.field2)
            instance.field3 = attrs.get('field3', instance.field3)
            instance.field4 = attrs.get('field4', instance.field4)
            return instance
        return models.myModel(attrs.get('_id'), attrs.get('field1'), attrs.get('field2')
        , attrs.get('field3'), attrs.get('field4'))
```

To know more about serializers of django REST framework, please reference [here](https://www.django-rest-framework.org/api-guide/serializers/).


### REST API

Now we need to build the web APIs to serve the serialized data as the http response.
Here we provide the APIs below by function based views. 

```
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import api_serializers as api_ser

@api_view(['GET'])
def read_mycollection_all(request):   
    if request.method == 'GET':
        data_list = []
        db_obj = dbutilities.db_util('mycollection')
        db_data = db_obj.read_documents_all('_id')       
        for doc in db_data:  
            formated_doc= models.myModel( doc['_id'], doc['field1'], doc['field2'], doc['field3'], doc['field4'] )
            data_list.append(formated_doc)            
        serializedList = api_ser.mySerializer(data_list, many=True)
        return Response(serializedList.data)
    else:
        return Response({'status':'read_mycollection_all fail'})

@api_view(['GET'])
def read_mycollection_byid(request, id):   
    if request.method == 'GET':
        formated_doc = None
        db_obj = dbutilities.db_util('mycollection')
        doc = db_obj.read_document(id)
        if doc is None:
            return Response({'status':'read_mycollection_byid no document'})
        else:      
            formated_doc= models.myModel( doc['_id'], doc['field1'], doc['field2'], doc['field3'], doc['field4'] )       
            serializedList = api_ser.mySerializer(formated_doc, many=False)
            return Response(serializedList.data)   
    else:
        return Response({'status':'read_mycollection_byid fail'})

@api_view(['POST'])
def create_doc_in_mycollection_return_newone(request):
    serialized = api_ser.mySerializer(data = request.data)
    if serialized.is_valid():
        reqId = request.data.get("_id")
        if reqId != None:
            tempdict = request.data.pop('_id')  
        db_obj = dbutilities.db_util('mycollection')     
        inserted_ids = db_obj.create_documents([request.data])  
        newdoc = None
        if(len(inserted_ids) > 0):
            newdoc = db_obj.read_document(inserted_ids[0])
        if newdoc is None:
            return Response({'status':'create_doc_in_mycollection_return_newone no doc is created'})
        else:      
            formated_doc= models.myModel( newdoc['_id'], newdoc['field1'], newdoc['field2'], newdoc['field3'], newdoc['field4'] )
            serializedList = api_ser.mySerializer(formated_doc, many=False)
            return Response(serializedList.data)   
    else:
        return Response(serialized._errors)

@api_view(['POST'])
def replace_doc_in_mycollection_return_newone(request):
    serialized = api_ser.mySerializer(data = request.data)
    if serialized.is_valid():
        reqId = request.data.get("_id")
        filterId = {'_id': ObjectId(reqId)}
        if reqId != None:
            tempdict = request.data.pop('_id')
        replacedata = request.data
        db_obj = dbutilities.db_util('mycollection')      
        modified_count = db_obj.replace_document(filterId, replacedata)
        newdoc = None
        if(modified_count > 0):
            newdoc = db_obj.read_document(reqId)
        if newdoc is None:
            return Response({'status':'replace_doc_in_mycollection_return_newone no doc id replaced'})
        else:      
            formated_doc= models.myModel( newdoc['_id'], newdoc['field1'], newdoc['field2'], newdoc['field3'], newdoc['field4'] )
            serializedList = api_ser.mySerializer(formated_doc, many=False)
            return Response(serializedList.data)   
    else:
        return Response(serialized._errors)

@api_view(['POST'])
def delete_doc_in_mycollection_return_count(request):
    serialized = api_ser.mySerializer(data = request.data)
    if serialized.is_valid():
        reqId = request.data.get("_id")
        filterId = {'_id': ObjectId(reqId)}
        db_obj = dbutilities.db_util('mycollection')        
        deleted_count = db_obj.delete_documents(filterId)
        if deleted_count is None:
            return Response({'status':'delete_doc_in_mycollection_return_count no doc is deleted'})
        else:
            return Response({
                'status':'delete_doc_in_mycollection_return_count success',
                'data' : deleted_count
            })
    else:
        return Response(serialized._errors)
```
For more information about API views of django REST framework, please reference [here](https://www.django-rest-framework.org/api-guide/views/).
<br />

Furthermore, we have to assign some proper urls to access the API views above.
So, add the urls below into "urlpatterns" in the file urls.py.
```
from django.conf.urls import url
from app import api_views

urlpatterns = [
    ... 
    url(r'^read_mycollection_all/$', api_views.read_mycollection_all),
    url(r'^read_mycollection_byid/(?P<id>[-\w]+)/$', api_views.read_mycollection_byid),
    url(r'^create_doc_in_mycollection_return_newone/$', api_views.create_doc_in_mycollection_return_newone),
    url(r'^replace_doc_in_mycollection_return_newone/$', api_views.replace_doc_in_mycollection_return_newone),
    url(r'^delete_doc_in_mycollection_return_count/$', api_views.delete_doc_in_mycollection_return_count),
]
```

Additionally, we can test these APIs by the following urls in a browser. (The port is setted in docker-compose.yml)

> http://localhost:9900/read_mycollection_all

> http://localhost:9900/read_mycollection_byid/5e461002d069ba45a5fbe9da

> http://localhost:9900/create_doc_in_mycollection_return_newone/

> http://localhost:9900/replace_doc_in_mycollection_return_newone/

> http://localhost:9900/delete_doc_in_mycollection_return_count/

The test data for delete operation: 
e.g. {"_id": "5e46533fa8a7194456fbe99b"} 

The test data for insert and modify operations:  
e.g. { "_id": "5d53ca1d72be9fe767779e70", "field1" : "value1", "field2" : {"item1":"value2", "item2":"value3" }, "field3" : "2020-01-01T00:00:00Z", "field4: : 2.34 }


## Frontend app: Angular

Most front-end applications communicate with backend services over the HTTP protocol.
In this example, we use angular HttpClient to perform it.
More details about HttpClient, please reference [here](https://angular.io/guide/http).

### Methods in services
Set an object matching the data model above for data passing.
```
export class Product {
    _id: string;
    field1: string;
    field2: object;
    field3: string;
    field4: number;
}
```

To access the web APIs, We need some methods to send http request and receive http response.
So, build the methods for http get and http post in angular services.

```
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '.';

let url: string = 'http://localhost:9900/';
let header: object = { headers: new HttpHeaders({'Content-Type':  'application/json'}) };

getProducts (): Observable<Product[]> {
    return this.http.get<Product[]>( url+'read_mycollection_all', header )
      .pipe( tap(_ => this.log('fetched')) );
}

getProduct(id: string): Observable<Product> {
    return this.http.get<Product>( url+'read_mycollection_byid/'+id, header)
      .pipe( tap(_ => this.log(`fetched id=${id}`)) );
}

insertProduct (product: Product): Observable<Product> {
    return this.http.post<Product>( url+'create_doc_in_mycollection_return_newone/', product, header )
      .pipe( tap((newItem: Product) => this.log(`added w/ id=${newItem._id}`)) );
}

replaceProduct (product: Product): Observable<Product> {
    return this.http.post<Product>( url+'replace_doc_in_mycollection_return_newone/', product, header )
      .pipe( tap(_ => this.log(`updated id=${product._id}`)) );
}
  
deleteProduct (product: Product): Observable<{}> {
    return this.http.post( url+'delete_doc_in_mycollection_return_count/', product, header )
      .pipe( tap(_ => this.log(`deleted id=${product._id}`)) );
}

```

### Methods in components
Moreover, we use the methods in the services in components. The fetched data from services will show in html pages through components, and also the gotten data from html pages can be send to services through components.

```
@Input() product: Product;
products: Product[];

getProducts(): void {
    this.productQueryService.getProducts()
      .subscribe(products => this.products = products );
} 

getProduct(id:string): void {
    this.productDetailService.getProduct(id)
      .subscribe(product => this.product = product);
}

insertProduct(){
    this.productInsertService.insertProduct(this.product)
      .subscribe(() => { console.log('product inserted'); });
}

replaceProduct(){
    this.productEditService.replaceProduct(this.product)
      .subscribe(() => { console.log('product replaced'); });
}

deleteProduct(): void{
    this.productDetailService.deleteProduct(this.product)
      .subscribe(() => { console.log('product deleted'); });
}
```

## Remark
To resolve the problem about "cors policy no 'access-control-allow-origin' header is present on the requested resource", we can install django-cors-headers by pip and then insert the configurations below into settings.py.
```
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
]
```
Also, don't forget to restart docker-compose or the docker container of django.


## References
- [See more topics in my website](http://www.tzuchikao.com/en/notes/)
- [Write scripts for the mongo shell](https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/)
- [pymongo – Python driver for MongoDB](https://api.mongodb.com/python/current/api/pymongo/index.html)
- [Django REST framework](https://www.django-rest-framework.org/)
- [Angular docs](https://angular.io/docs)

