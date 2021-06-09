const STATUS_CODE = {
    OK: 200,
    UPDATE: 201,
    NOT_FOUND: 404,
    ERROR_UPDATE: 505,
    EMAIL_ALREADY_EXIST: 444,
    ACCESS_CODE_INVALID: 455,
    DELETED: 222,
    ERROR_DELETE: 409,
    UPLOAD_ERROR: 464
}
const ROLE = {
    ADMIN: 1,
    REPRESENTANT: 2,
    PATIENT: 3,
    SUPER_ADMIN: 4
}

module.exports = { STATUS_CODE, ROLE }
