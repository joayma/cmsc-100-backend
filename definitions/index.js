const UniqueIDData = {
    type: 'string',
    description: 'A unique identifier',
    value: '18e83369-45bb-4c45-9c9e-5e0bd70d2e5a',
    example: '18e83369-45bb-4c45-9c9e-5e0bd70d2e5a'
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

const GetManyTodoResponse = {
    type: 'object',
    description: 'Returns a list of todos',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: TodoListData
    }
};

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
    PutTodoRequest
};