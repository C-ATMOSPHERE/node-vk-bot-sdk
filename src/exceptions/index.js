class ApiError extends Error {
    constructor(error_code, error_msg, request_params) {
        super()
        this.error_code = error_code
        this.error_msg = error_msg
        this.request_params = request_params
    }
}

class TypeError extends Error {
    constructor(message) {
        super(message);
    }
}

class UploadError extends Error {
    constructor(message) {
        super(message);
    }
}

class ValidateError extends Error {
    constructor(message) {
        super(message);
    }
}

class NotImplementedError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = {
    ApiError,
    TypeError,
    UploadError,
    ValidateError,
    NotImplementedError
};