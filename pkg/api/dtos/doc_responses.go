package dtos

// A GenericError is the default error message that is generated.
// For certain status codes there are more appropriate error structures.
//
// swagger:response genericError
type GenericError struct {
	// in: body
	Body struct {
		// a human readable version of the error
		// required: true
		Message string `json:"message"`
	} `json:"body"`
}

// Unauthorized
//
// swagger:response unauthorisedError
type UnauthorizedError struct {
	GenericError
}

// Access Denied
//
// swagger:response forbiddenError
type ForbiddenError struct {
	GenericError
}

// Not Found
//
// swagger:response notFoundError
type NotFoundError struct {
	GenericError
}

// OK
//
// swagger:response okResponse
type OKResponse struct {
	// in: body
	Body struct{} `json:"body"`
}
