# PUT update todo

- Can be done by the owner or admin type
- owner can update text or isDone but not all are required
- admin type can only update isDone
- if no payload has been sent or payload is empty, return bad request (400)
- if admin type updates text, return forbidden (403)
- if taskId in the parameter is not found in the database, return no found (404)
- dateUpdated should be updated with the current date
- should return text, username, isDone, dateCreated, and dateUpdated
