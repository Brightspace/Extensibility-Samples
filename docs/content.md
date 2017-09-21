# Upload Content - multipart/mixed
The code for this example application can be found in the [content.js](../src/apis/content.js) file. There are two examples that show the uploading of a simple HTML document and a Word document with the .docx extension. These files can be found in the [/content/fileupload](../content/file-upload) folder.

## API Route Overview
```
POST /d2l/api/le/(version)/(orgUnit)/content/modules/(moduleId)/structure/
```
The [Content Upload API](http://docs.valence.desire2learn.com/res/content.html#post--d2l-api-le-(version)-(orgUnitId)-content-modules-(moduleId)-structure-) route uses a multipart-mixed request in order to upload content to a specific module in a course. For an overview of other requests that use the multipart/mixed Content-Type you can visit [here](http://docs.valence.desire2learn.com/basic/fileupload.html?highlight=RFC2388%20Multipart/mixed).

## multipart/mixed
The ```multipart/mixed``` Content-Type is used in some APIs when you want to upload a file and associated meta-data in the same request. The body of the request is formatted using a boundary field to seperate the different types of data. For the content upload the API is expecting a body that has a JSON block with the content details and a file block representing the data for the file. A mock body for the request might look like this:

```
--xxBOUNDARYxx
Content-Type: application/json

{"IsHidden": false, "IsLocked": false, "ShortTitle": "Test", "Type": 1,
"DueDate": null, "Url": "/content/extensibility/EXT-104/file.txt",
"StartDate": null, "TopicType": 1, "EndDate": null, "Title": "Test topic
content"}
--xxBOUNDARYxx
Content-Disposition: form-data; name=""; filename="file.txt"
Content-Type: text/plain

This is a sample text file
with some text content.
--xxBOUNDARYxx--
```

**Important Notes**
* The line endings for the body must be ```/r/n```
* There must be an additional new line(```/r/n```) between the Content-Type and the content within the boundaries.
* The boundary will be passed in the ```Content-Type``` header. Using the above example the header would look like:

    ```Content-Type: multipart/mixed;boundary=xxBOUNDARYxx```
* Notice that the boundary in the header does not contain the dashes
* Two dashes must be added to the front of the boundary when formatted in the body and the final boundary must have two dashes at the end in addition to the two at the front. This looks like:

    ```--xxBOUNDARYxx```
    
    End Boundary:

    ```--xxBOUNDARYxx--```

## The Code
In the sample provided there are two routes created that will upload content to a course with the given module id. Both the routes take query parameters named, ```orgUnitId``` and ```moduleId``` that will be used when uploading the content. The index page has these values hardcoded and they can be changed. Please read [Configurations](configurations.md) for more information on making this change.

The first route provided is ```/uploadhtmlcontent```.
* This route can be used to upload a simple HTML file.
* This can be accomplished using OAuth 2.0 Authentication or ID/Key Authentication.

The second route provided is ```/uploadworddocument```.
* This route can be used to upload a Word document with the .docx extension.
* This can be accomplished using OAuth 2.0 Authentication or ID/Key Authentication.
* The Word document data is formatted to base64 encoding and the additional ```base64``` query parameter is set to ```true``` for the API request.
* The ```Content-Type``` for the word document is set to ```application/vnd.openxmlformats-officedocument.wordprocessingml.document```.

### Creating The Request
In order to create the body for the request a function was created that takes in a bunch of parameters and accordingly formats a string with the properly formatted data for the multipart/mixed request. Here is the code for this [function](../src/content.js#L159).

