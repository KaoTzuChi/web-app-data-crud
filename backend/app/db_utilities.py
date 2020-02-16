# import logging
from datetime import date, time, datetime
import pymongo
from backend import settings as settings
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson.objectid import ObjectId

class db_util:
    def __init__(self, param_collection):

        self.host = settings.MONGO_DATABASE['host']
        self.dbname = settings.MONGO_DATABASE['name']
        self.user = settings.MONGO_DATABASE['user']
        self.password = settings.MONGO_DATABASE['password']

        self.connection = None
        self.database = None
        self.collection_name = None
        
        print('Mongo version',pymongo.__version__)
        if (self.host!=None) & (self.dbname!=None) & (self.user!=None) & (self.password!=None):
            self.set_connection()
            self.set_database()
            self.set_collection_name(param_collection)

    def __del__(self):
        try:
            if self.database:
                self.database.logout()
            if self.connection:
                return self.connection.close()
        except Exception as e:
            print('fail >>> %s.%s: %s' % ('db_util','__del__',e))

    def set_connection(self):
        try:
            self.connection = MongoClient(self.host)
        except Exception as e:
            if self.connection:
                return self.connection.close()
            print('fail >>> %s.%s: %s' % ('db_util','set_connection',e))

    def get_connection(self):
        return self.connection

    def set_database(self):
        try:
            _conn = self.get_connection()        
            if _conn:
                _db = _conn[self.dbname]
                if _db:
                    _db.logout()
                    _db.authenticate(self.user, self.password)
                    self.database = _db
        except Exception as e:
            print('fail >>> %s.%s: %s' % ('db_util','set_database',e))
    
    def get_database(self):
        return self.database

    def set_collection_name(self, param):
        self.collection_name = param

    def get_collection_name(self):
        return self.collection_name

    def get_collection_count(self):
        try:
            _db = self.get_database()
            _colname = self.get_collection_name()
            if _db:
                if _colname:
                    _collection = _db[_colname]
                    if _collection:
                        _cnt = _collection.count_documents({})
                        return _cnt     
        except Exception as e:
            print('fail >>> %s.%s: %s' % ('db_util','get_collection_count',e))

    def read_documents_all(self, checkfield):
        try:
            _db = self.get_database()
            _colname = self.get_collection_name()
            _cursor = None
            if _db:
                if _colname:
                    _collection = _db[_colname]
                    if _collection:
                        _cursor = _collection.find({checkfield: {'$exists': True}})
            return _cursor     
        except Exception as e:
            print('fail >>> %s.%s: %s' % ('db_util','read_documents_all ex=',e))

    def read_document(self, id_string):
        try:
            _db = self.get_database()
            _colname = self.get_collection_name()
            _result = None
            if _db:
                if _colname:
                    _collection = _db[_colname]
                    if _collection:
                        _cursor = _collection.find({'_id': ObjectId(id_string)})   
                        for doc in _cursor:
                            _result = doc                
            return _result     
        except Exception as e:
            print('fail >>> %s.%s: %s' % ('db_util','read_document ex=',e))

    def create_documents(self, documents):
        try:
            _db = self.get_database()
            _colname = self.get_collection_name()
            _return = None
            if _db:
                if _colname:
                    _collection = _db[_colname]
                    if _collection:
                        _result = _collection.insert_many(documents)
                        _return = _result.inserted_ids
            return _return  
        except Exception as e:
            print('fail >>> %s.%s: %s' % ('db_util','create_documents ex=',e))

    def delete_documents(self, filterfield):
        try:
            _db = self.get_database()
            _colname = self.get_collection_name()
            _return = None
            if _db:
                if _colname:
                    _collection = _db[_colname]
                    if _collection:
                        _result = _collection.delete_many(filterfield)
                        _return = _result.deleted_count
            return _return 
        except Exception as e:
            print('fail >>> %s.%s: %s' % ('db_util','delete_documents ex=',e))

    def update_documents(self, filterfield, replacement):
        try:
            _db = self.get_database()
            _colname = self.get_collection_name()
            _return = None
            if _db:
                if _colname:
                    _collection = _db[_colname]
                    if _collection:
                        _result = _collection.update_many(filterfield, replacement)
                        _return = _result.modified_count
            return _return  
        except Exception as e:
            print('fail >>> %s.%s: %s' % ('db_util','update_documents ex=',e))

    def replace_document(self, filterfield, replacement):
        try:
            _db = self.get_database()
            _colname = self.get_collection_name()
            _return = None
            if _db:
                if _colname:
                    _collection = _db[_colname]
                    if _collection:
                        _result = _collection.replace_one(filterfield, replacement)
                        _return = _result.modified_count
            return _return  
        except Exception as e:
            print('fail >>> %s.%s: %s' % ('db_util','replace_document ex=',e))




def getFieldListByItem( doc, fieldkey, itemkey):
    returndata = { itemkey : '' }
    if doc != None:
        if type(doc) == dict:
            if doc.get(fieldkey) != None:
                if doc[fieldkey] != None:
                    if type(doc[fieldkey]) == dict:
                        if doc[fieldkey].get(itemkey) != None:
                            if doc[fieldkey][itemkey] != None:
                                returndata = { itemkey : doc[fieldkey][itemkey] }
    return returndata

def getFieldList( doc, key):
    returndata = []
    if doc != None:
        if type(doc) == dict:
            if doc.get(key) != None:
                if ((doc[key] != None) & (len(doc[key])>0) ):
                    returndata = doc[key]
    return returndata

def getFieldDict( doc, key, item_names):
    returndata = {}
    allnull = False
    if doc != None:
        if type(doc) == dict:
            if doc.get(key) != None:
                if doc[key] != None:
                    if type(doc[key]) == dict:
                        for itemname in item_names:
                            if (doc[key].get(itemname) != None):
                                allnull = True

                        if (allnull):
                            returndata.update(doc[key])
    return returndata

def getIdString( doc, key):
    returndata = ''
    if doc != None:
        if type(doc) == dict:
            if doc.get(key) != None:
                if doc[key] != None:
                    returndata = str(doc[key])
    return returndata

def getFieldString( doc, key):
    returndata = ''
    if doc != None:
        if type(doc) == dict:
            if doc.get(key) != None:
                if doc[key] != None:
                    returndata = str(doc[key])
    return returndata

def getFieldDecimal( doc, key):
    returndata = 0.00
    if doc != None:
        if type(doc) == dict:
            if doc.get(key) != None:
                if ((doc[key] != None)&(str(doc[key])!='')):
                    returndata = doc[key]
    return returndata

def getFieldDatetime( doc, key):
    returndata = None
    if doc != None:
        if type(doc) == dict:
            if doc.get(key) != None:
                if doc[key] != None:
                    returndata = doc[key]
    return returndata

def getFieldInteger( doc, key):
    returndata = None
    if doc != None:
        if type(doc) == dict:
            if doc.get(key) != None:
                if ( (doc[key] != None) & (str(doc[key])!='') & (type(doc[key]) == int) ):
                    returndata = doc[key]
    return returndata
