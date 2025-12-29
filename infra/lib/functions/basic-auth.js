/* eslint-disable */
// CloudFront Function: handler is called by CloudFront, not referenced in code
function handler(event) {
  var request = event.request;
  var headers = request.headers;

  // Expected Authorization header value (Base64 encoded credentials)
  // This will be replaced by CDK with the actual Base64-encoded value
  var expectedAuthString = 'Basic %%BASIC_AUTH_BASE64%%';

  // Check if the Authorization header exists and matches
  if (
    typeof headers.authorization === 'undefined' ||
    headers.authorization.value !== expectedAuthString
  ) {
    return {
      statusCode: 401,
      statusDescription: 'Unauthorized',
      headers: {
        'www-authenticate': { value: 'Basic realm="%%REALM%%"' },
      },
    };
  }

  // Authentication successful, continue with the request
  return request;
}
