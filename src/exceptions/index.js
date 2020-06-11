class ApiError extends Error {
    constructor(error_code, error_msg, request_params) {
        super()
        this.error_code = error_code
        this.error_msg = error_msg
        this.request_params = request_params
    }
}

class TypeError extends Error { }
class UploadError extends Error { }
class ValidateError extends Error { }
class MiddlewareError extends Error { }
class NotImplementedError extends Error { }

module.exports = {
    ApiError,
    TypeError,
    UploadError,
    ValidateError,
    MiddlewareError,
    NotImplementedError
};