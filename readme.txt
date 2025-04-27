# instructions for setting up and running lostnfound on windows 11

------------------------------------------------------------------

1. preparations
--------------
# 1.1 use git https://github.com/chennissan/lostnfound.git
# 1.2 use local mongodb on localhost:27107
  # (altenatively you can use atlas and update MONGODB_URI in server/.env) 
# 1.3 verify configuration
# 1.3.1 server will run on port 5000 - see PORT in server/.env and REACT_APP_API_URL in front/.env
# 1.3.2 frontend will run on port 3000 - see PORT in front/.env

# 2. initialize the db
----------------------
# 2.1 open a new command prompt
#2.2 change to server dir
  > cd server
# 2.3 the following will initialize db with a single admin user (password is admin)
  > node createdb clean
#2.4 OPTIONAL: to get a demo db you can run "node createdb run"

# 3. install and start server
-----------------------------
# 3.1 open a new command prompt
# 3.2 change to server dir
    > cd server
# 3.3 install server
    > npm install
# 3.4 start server
    > npm start

# 4. install and start frontend
-------------------------------
# 4.1 open a new command prompt
# 4.2 change to frontend dir
    > cd front
# 4.3 install frontend
    > npm install
# 4.4 start frontend
    > npm start
