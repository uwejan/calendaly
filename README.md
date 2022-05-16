## Simple task for exceptionaly head of platform Gonzalo de Salterain

### Requirements;
* Google account
* Enable `Calendar API`
* Create `OAUTH2`credentials, consent screen and download `.json`file into the root directory.
* Rename the downloaded json file, to `credentials.json`
* Modify `credentials.json redirect_uris` to the following `"redirect_uris": ["http://localhost:3000/api/google/auth/back"]`
* MongoDb, to store session details, required in `.env` file.
* Zoom Developer account, `JWT` authentication used you will need to copy your credentials into `.env`file.

### How tos;

* `cp .env.example .env`
* Fill `.env` with your details.
* `npm install`
* `npm run start`
* post man collection included in teh base directory


### Available rest-api resources;
* `/api/auth`
  * `/register` POST
  * `/login` POST
* `/api/google`
  * `/create/url` GET `JWT`
  * `/auth/back` GET 
  * `/auth/store` POST `JWT`
* `/api/user/events`
  * `/list` GET `JWT`
* `/api/user/meetings`
  * `/create` POST `JWT`

### How does it work?
* using postman for apis
* register and login
* use the returned jwt token for further operations
* GET `/api/google/create/url`
  * copy the returned url and paste it into your browser
  * if you are logged-in to your gmail it will ask for authorization
  * simply approve and you should see json payload 
  * copy `code` from payload 
* POST `/api/google/create/store`
  * past in the copied `code` as payload
  * send the request
* GET `/api/user/events/list` if you see your calendar events for today then it works
* POST `/api/user/meetings/create` to create new zoom meeting with following payload
  
````
    {
    "meeting_start_date": "2022-05-17",
    "meeting_start_hour": "15",
    "meeting_start_minute": "0",
    "meeting_duration": "30",
    "meeting_title": "Awesome meeting!"
    } 

````
* after successfull request you should see your meeting data returned, it also creates an event in your calendar
* Repeat POST `/api/user/meetings/create` with same payload
  * you should get `The time conflicts with another meeting` it works.


**License**

This app is available under the ISC License. Use it wisely.

