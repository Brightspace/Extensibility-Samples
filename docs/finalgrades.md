# Final Grades
The code for this API sample can be found in the [grades.js](../src/grades.js) file. This example shows how to make a call to the classlist in order to fetch all the users and then asynchronously gather each user's final grade.

## API Route Overview
In order to fetch the Final Grades for a specific course, two API calls are used:
* [Classlist API](http://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-le-(version)-(orgUnitId)-classlist-)
    ```
    /d2l/api/le/(version)/(orgUnitId)/classlist/
    ```
* [Final Grades API](http://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-final-values-(userId))
    ```
    /d2l/api/le/(version)/(orgUnitId)/grades/final/values/(userId)
    ```

## The Code
The example provided exposes a route for accessing the Final Grade information for a given course. The course is determine from the ```orgUnitId``` query parameter. The index page has this value hardcoded and it can be changed. Please read [Configurations](configurations.md) for more information on making this change.

The route provided is ```/finalgrades```
* This route takes the result from the classlist and combines each user object with the object received from calling the final grades route resulting in a list of users and their final grade.
* The route can be accessed using OAuth 2.0 Authentication or the ID/Key authentication.
* To asynchronously call the final grades route for each user in the classlist the Node [async](https://www.npmjs.com/package/async) library was used.

