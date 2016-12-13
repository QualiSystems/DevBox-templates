import json
from flask import Flask
from flask import request

app = Flask(__name__)

all_users = [{'id':0, 'name':'Malcolm', 'age':'43'},{'id':1, 'name':'Jayne', 'age':'40'},{'id':2, 'name':'River', 'age':'22'}]
    
def find_user(id):
    for user in all_users:
        if user['id'] == id:
            return user
    
@app.route('/users', methods=['GET'])
def users():
    print request.data
    users = all_users
    return json.dumps(users)
    
@app.route('/users', methods=['POST'])
def add_user():
    user = json.loads(request.data)
    print user
    all_users.append(user)
    return ''
    
@app.route('/users/<int:id>', methods=['GET'])
def user(id):
    user = find_user(id)
    return json.dumps(user)

if __name__ == '__main__':
    app.run(port=9000,threaded=True,host= '0.0.0.0')
