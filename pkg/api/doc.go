// Package api Grafana HTTP API.
//
// The Grafana backend exposes an HTTP API, the same API is used by the frontend to do
// everything from saving dashboards, creating users and updating data sources.
//
// Schemes: http
// Host: localhost:3000
// BasePath: /api
// Version: 0.0.1
// License: MIT http://opensource.org/licenses/MIT
// Contact: Grafana Labs<hello@grafana.com> https://grafana.com
//
// Consumes:
// - application/json
// Produces:
// - application/json
//
// Security:
// - basic
//
// SecurityDefinitions:
// basic:
//  type: basic
//
// Extensions:
// x-tagGroups:
// - name: General
//   tags: ["dashboards"]
// - name: Server Administration
//   tags: ["adminSettings", "global_users"]
//
// swagger:meta
package api
