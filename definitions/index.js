const UniqueIDData = {
    type: 'string',
    description: 'A unique identifier',
    value: '18e83369-45bb-4c45-9c9e-5e0bd70d2e5a',
    example: '18e83369-45bb-4c45-9c9e-5e0bd70d2e5a'
};

const UsernameData = {
    type: 'string',
    description: 'A unique username',
    value: 'jojoestar',
    example: 'jojoestar'
};

const FirstNameData = {
    type: 'string',
    description: 'First name of the user',
    value: 'joseph',
    example: 'joseph'
};

const LastNameData = {
    type: 'string',
    description: 'Last name of the user',
    value: 'joestar',
    example: 'joestar'
};

const PasswordData = {
    type: 'string',
    description: 'Password string',
    value: '18e8336945bb4c459c9e5e0bd70d2e5a',
    example: '18e8336945bb4c459c9e5e0bd70d2e5a'
};

const TextData = {
    type: 'string',
    description: 'Sample string',
    value: 'Hello world!',
    example: 'Hello world!'
};

const IsDoneData = {
    type: 'boolean',
    description: 'States whether a todo is tagged as done',
    value: true,
    example: true
};

const DateData = {
    type: 'number',
    description: 'A date value in Unix Epoch',
    value: 1632087786409,
    example: 1632087786409
};

const SuccessData = {
    type: 'boolean',
    description: 'State of a response',
    value: true,
    example: true
};

const LimitData = {
    type: 'number',
    description: 'Limit of number items in a query',
    value: 10,
    example: 10
};

const SuccessResponse = {
    type: 'object',
    description: 'Response with a success state only',
    properties: {
        success: SuccessData
    }
};

const TodoFullData = {
    type: 'object',
    description: 'Todo object data from the database',
    properties: {
        id: UniqueIDData,
        text: TextData,
        isDone: IsDoneData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
};

const TodoListData = {
    type: 'array',
    description: 'A list of todos',
    items: TodoFullData
};

const GetManyTodoQuery = {
    type: 'object',
    description: 'Query parameters for getting many todos',
    properties: {
        limit: LimitData,
        startDate: DateData,
        endDate: DateData
    }
};

const GetOneTodoParams = {
    type: 'object',
    description: 'Parameter for getting one todo',
    properties: {
        id: UniqueIDData
    }
}

const UserFullData = {
    type: 'object',
    description: 'User data without the password',
    properties: {
        username: UsernameData,
        firstName: FirstNameData,
        lastName: LastNameData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
}

const GetOneUserResponse = {
    type: 'object',
    description: 'Returns a user',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: UserFullData
    }
};

const GetManyTodoResponse = {
    type: 'object',
    description: 'Returns a list of todos',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: TodoListData
    }
};

const PostUserRequest = {
    type: 'object',
    description: 'User object data for creation',
    required: ['username', 'firstName', 'lastName', 'password'],
    properties: {
        username: UsernameData,
        firstName: FirstNameData,
        lastName: LastNameData,
        password: PasswordData,
    }
}

const PostTodoRequest = {
    type: 'object',
    description: 'Todo object data for creation',
    required: ['text'],
    properties: {
        text: TextData,
        isDone: IsDoneData,
    }
}

const PutTodoRequest = {
    type: 'object',
    description: 'Todo object data for update',
    properties: {
        text: TextData,
        isDone: IsDoneData,
    }
}

const GetOneTodoResponse = {
    type: 'object',
    description: 'Returns a todo',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: TodoFullData
    }
};

exports.definitions = {
    SuccessResponse,
    GetManyTodoResponse,
    GetManyTodoQuery,
    GetOneTodoParams,
    GetOneTodoResponse,
    PostTodoRequest,
    PutTodoRequest,
    PostUserRequest,
    GetOneUserResponse
};