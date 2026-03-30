export const SSB_API_NOTES = `
PxWebApi v2 quick rules

Base URL
- https://data.ssb.no/api/pxwebapi/v2

Rate and size limits
- Max 800000 cells per request, including empty cells
- Max 30 requests per minute per IP
- Prefer sequential large requests instead of firing many in parallel

Operational guidance
- Avoid 07:55-08:15 when possible because new releases at 08:00 can create heavy load
- Revised values scheduled for 08:00 can appear as 0 or dot between 05:00 and 08:00
- Metadata updates happen at 05:00 and 11:30 and tables can be unavailable during those windows

Core endpoints
- GET /tables
- GET /tables/{tableId}
- GET /tables/{tableId}/metadata
- GET /tables/{tableId}/data
- POST /tables/{tableId}/data
- GET /savedqueries/{id}
- GET /savedqueries/{id}/data

Query rules
- Default language is Norwegian; use lang=en for English
- Prefer dynamic time expressions like top(n), from(x), to(x), or range(x,y)
- Prefer wildcard selectors like * and ? instead of long explicit value lists
- GET URLs longer than about 2100 characters are unsafe; switch to POST
- Default outputFormat is json-stat2

Important GET parameter patterns
- valueCodes[Variable]=*
- valueCodes[Tid]=top(1)
- valueCodes[Tid]=from(2020)
- codeList[Variable]=valueSetOrAggregation
- outputValues[Variable]=aggregated|single
- outputFormat=csv|html|xlsx|json-stat2|px|json-px
- outputFormatParams=SeparatorSemicolon,UseCodesAndTexts
- stub=Var1,Var2
- heading=Var3

Error codes
- 400 invalid syntax
- 403 too large dataset
- 404 resource not found or URL too long
- 429 rate limit exceeded
- 503 service unavailable

JSON-stat notes
- json-stat2 is the default response format
- Missing/confidential values appear as null in value and the marker is exposed in status
- Common status markers are ., .., and :
`;
