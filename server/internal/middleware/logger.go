package middleware

import (
	"context"
	"net"
	"net/http"
	"time"

	"github.com/rs/zerolog/log"
	"server/pkg/ipquery"
)

type responseWriter struct {
	http.ResponseWriter
	status int
	bytes  int
}

func (rw *responseWriter) WriteHeader(status int) {
	rw.status = status
	rw.ResponseWriter.WriteHeader(status)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	n, err := rw.ResponseWriter.Write(b)
	rw.bytes += n
	return n, err
}

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		ww := &responseWriter{ResponseWriter: w, status: http.StatusOK}

		next.ServeHTTP(ww, r)

		ip, _, _ := net.SplitHostPort(r.RemoteAddr)

		log.Info().
			Str("method", r.Method).
			Str("path", r.URL.Path).
			Str("query", r.URL.RawQuery).
			Str("remote_ip", ip).
			Int("status", ww.status).
			Int("bytes", ww.bytes).
			Dur("latency", time.Since(start)).
			Msg("request")

		go enrichIPLog(ip)
	})
}

func enrichIPLog(ip string) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	info, err := ipquery.Query(ctx, ip)
	if err != nil || info == nil {
		return
	}

	log.Info().
		Str("ip", ip).
		Str("country", info.Location.CountryCode).
		Str("city", info.Location.City).
		Str("isp", info.ISP.ISP).
		Bool("is_vpn", info.Risk.IsVPN).
		Bool("is_proxy", info.Risk.IsProxy).
		Bool("is_tor", info.Risk.IsTor).
		Msg("ip_info")
}
