package httpclientprovider

import (
	"fmt"

	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/setting"
)

// New creates a new HTTP client provider with pre-configured middlewares.
func New(cfg *setting.Cfg) httpclient.Provider {
	logger := log.New("httpclient")
	userAgent := fmt.Sprintf("Grafana/%s", cfg.BuildVersion)
	middlewares := []httpclient.Middleware{
		TracingMiddleware(logger),
		DataSourceMetricsMiddleware(),
		SetUserAgentMiddleware(userAgent),
		httpclient.BasicAuthenticationMiddleware(),
		httpclient.CustomHeadersMiddleware(),
	}

	if cfg.SigV4AuthEnabled {
		middlewares = append(middlewares, SigV4Middleware())
	}

	return httpclient.NewProvider(httpclient.ProviderOptions{
		Middlewares: middlewares,
	})
}
