# GET get one todo

- can only be done by owner of the task or the admin of the task
- the object returned should have the username, text, isDone, dateUpdated, and dateCreated
- if taskId given in parameter is not found in database, return bad request (404)
