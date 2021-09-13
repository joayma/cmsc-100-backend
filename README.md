# GET get many todos
- can be done by owner of the tasks or admin type only
- when owner gets, should only return their own tasks
- when admin types, should return all tasks or when there's a filter of username
- both owner and admin can further filter their list by isDone property
- can have a limit with not more than 50. Default is 10.
- each object in the array should have: username, text, isDone , dateUpdated, dateCreated
- it should sort the array in terms of dateCreated or dateUpdated in a descending order only
- it should do pagination in terms of startDateCreated, endDateCreated, startDateUpdated, endDateUpdated (all can be used in one query)
