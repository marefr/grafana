+++
title = "plugin.json"
keywords = ["grafana", "plugins", "documentation"]
type = "docs"
aliases = ["/docs/grafana/latest/plugins/developing/plugin.json/"]
+++

# plugin.json

The plugin.json file is mandatory for all plugins. When Grafana starts it will scan the plugin folders and mount every folder that contains a plugin.json file unless the folder contains a subfolder named `dist`. In that case grafana will mount the `dist` folder instead.

## Schema

| Property                                | Type    | Required | Description                                                                                                                          |
| --------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| id                                      | string  | yes      | Unique name of the plugin. If the plugin is published on Grafana.com then the plugin id has to follow the naming conventions.        |
| type                                    | string  | yes      | Plugin type. Possible values are `app`, `datasource`, `panel`.                                                                       |
| name                                    | string  | yes      | Human-readable name of the plugin that is shown to the user in the UI.                                                               |
| category                                | string  | no       | Plugin category used on the Add data source page. Possible values are: `tsdb`, `logging`, `cloud`, `tracing`, `sql`.                 |
| annotations                             | boolean | no       | For data source plugins. If the plugin supports annotation queries.                                                                  |
| alerting                                | boolean | no       | For data source plugins. If the plugin supports alerting.                                                                            |
| backend                                 | boolean | no       | If the plugin has a backend component.                                                                                               |
| executable                              | string  | no       | The first part of the file name of the backend component executables (there can three binaries for linux, darwin and windows).       |
| logs                                    | boolean | no       | For data source plugins. If the plugin supports logs.                                                                                |
| metrics                                 | boolean | no       | For data source plugins. If the plugin supports metric queries. Used in the Explore feature.                                         |
| mixed                                   | boolean | no       | Not to be used by external plugins. Special property for the built-in mixed plugin.                                                  |
| sort                                    | number  | no       | Internal property for sorting. Cannot be used as will be overwritten by Grafana.                                                     |
| streaming                               | boolean | no       | For data source plugins. If the plugin supports streaming.                                                                           |
| tracing                                 | boolean | no       | For data source plugins. If the plugin supports tracing.                                                                             |
| hasQueryHelp                            | boolean | no       | For data source plugins. TODO not sure if this is used.                                                                              |
| info                                    | object  | yes      | See [Info property]({{< relref "#info-property" >}})                                                                                 |
| dependencies                            | object  | yes      | See [Dependencies property]({{< relref "#dependencies-property" >}})                                                                 |
| queryOptions                            | object  | no       | See [Query Options Property]({{< relref "#query-options-property" >}})                                                               |
| routes                                  | array   | no       | See [Routes Property]({{< relref "#routes-property" >}})                                                                             |

### Info Property

The top level `info` property is used to define meta data for a plugin. Some fields are used on the plugins page in Grafana and others on Grafana.com if the plugin is published.

| Property                           | Type    | Required | Description                                                                                                                          |
| ---------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| author                             | object  | no       | Information about the plugin author.                                                                                                 |
| author.name                        | string  | no       | Author's name.                                                                                                                       |
| author.url                         | string  | no       | Link to author's website.                                                                                                            |
| description                        | string  | no       | Description of plugin. Used on the plugins page in Grafana and for search on grafana.com.                                            |
| keywords                           | array   | no       | Array of plugin keywords. Used for search on grafana.com.                                                                            |
| links                              | array   | no       | An array of link objects to be displayed on this plugin's project page in the form `{name: 'foo', url: 'http://example.com'}`        |
| logos                              | object  | yes      | SVG images that are used as plugin icons.                                                                                            |
| logos.small                        | string  | yes      | Link to the "small" version of the plugin logo, which must be an SVG image. "Large" and "small" logos can be the same image.         |
| logos.large                        | string  | yes      | Link to the "large" version of the plugin logo, which must be an SVG image. "Large" and "small" logos can be the same image.         |
| screenshots                        | array   | no       | An array of screenshot objects in the form `{name: 'bar', path: 'img/screenshot.png'}`                                               |
| updated                            | string  | yes      | Date when this plugin was built. Use `%TODAY%` for Grafana to autopopulate this value.                                               |
| version                            | string  | yes      | Project version of this commit. Use `%VERSION%` for Grafana to autopopulate this value.                                              |

### Dependencies Property

The top level `dependencies` property is used to define Grafana version dependency and plugin dependencies, if any.

| Property                   | Type    | Required | Description                                                                                                                          |
| -------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| grafanaVersion             | string  | yes      | Required Grafana version for this plugin. For example `6.x.x 7.x.x` if plugin works on Grafana v6.x and v7.x.                        |
| plugins                    | array   | no       | An array of required plugins on which this plugin depends.                                                                           |

### Query Options Property

For data source plugins. There is a query options section in the plugin's query editor and these options can be turned on if needed.

| Property                   | Type    | Required | Description                                                                                                 |
| -------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| maxDataPoints              | boolean | no       | If the `max data points` option should be shown in the query options section in the query editor.           |
| minInterval                | boolean | no       | If the `min interval` option should be shown in the query options section in the query editor.              |
| cacheTimeout               | boolean | no       | If the `cache timeout` option should be shown in the query options section in the query editor.             |

### Routes property

For data source plugins. Proxy routes used for plugin authentication and adding headers to HTTP requests made by the plugin. See [Authentication]({{< relref "authentication.md" >}}) for more information.

| Property                       | Type    | Required | Description                                                                                |
| ------------------------------ | ------- | -------- | ------------------------------------------------------------------------------------------ |
| path                           | string  | no       | The route path that is replaced by the route url field when proxying the call.             |
| method                         | string  | no       | Route method matches the HTTP verb like GET or POST.                                       |
| url                            | string  | no       | Route url is where the request is proxied to.                                              |
| headers                        | array   | no       | Route headers adds HTTP headers to the proxied request.                                    |
| headers[].name                 | array   | no       | HTTP header name.                                                                          |
| headers[].content              | array   | no       | HTTP header value.                                                                         |
| tokenAuth                      | object  | no       | Token authentication section used with an OAuth API.                                       |
| tokenAuth.url                  | string  | no       | Url to fetch the authentication token.                                                     |
| tokenAuth.params               | object  | no       | Params for the token authentication request.                                               |
| tokenAuth.params.grant_type    | string  | no       | OAuth grant type.                                                                          |
| tokenAuth.params.client_id     | string  | no       | OAuth client id.                                                                           |
| tokenAuth.params.client_secret | string  | no       | OAuth client secret. Usually populated by decrypting the secret from the SecureJson blob.  |
| tokenAuth.params.resource      | string  | no       | OAuth resource.                                                                            |

## Plugin.json Example

Here's an example of an up-to-date plugin.json file:

https://github.com/grafana/clock-panel/blob/master/src/plugin.json
