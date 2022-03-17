FROM python:3.8

WORKDIR /app

COPY requirements.txt requirements.txt
RUN apt-get -y update && apt-get install -y libzbar-dev && apt-get install -y libpoppler-cpp-dev
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]