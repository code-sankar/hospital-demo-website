/**
 * Parses and REPLACES the request part with the parsed value, so handlers only
 * ever see data that has been through the schema — no stray fields.
 */
export const validate = (schemas) => (req, _res, next) => {
  try {
    if (schemas.body) req.body = schemas.body.parse(req.body)
    if (schemas.query) req.validatedQuery = schemas.query.parse(req.query)
    if (schemas.params) req.params = schemas.params.parse(req.params)
    next()
  } catch (err) {
    next(err)
  }
}
