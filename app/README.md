# Sample App
This app is written in Python, and can be deployed on an `Ubuntu 20.04` instance with the following commands:
~~~
apt-get update
apt-get install -y --no-install-recommends build-essential python3 python3-pip python3-dev nginx uwsgi-core
pip3 install pipenv
cp nginx-app.conf /etc/nginx/conf.d/

# App is now ready to run using the script:
./start.sh
~~~