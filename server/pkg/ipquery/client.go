package ipquery

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const baseURL = "https://api.ipquery.io"

var httpClient = &http.Client{Timeout: 3 * time.Second}

type IPInfo struct {
	IP       string   `json:"ip"`
	ISP      ISP      `json:"isp"`
	Location Location `json:"location"`
	Risk     Risk     `json:"risk"`
}

type ISP struct {
	ASN string `json:"asn"`
	Org string `json:"org"`
	ISP string `json:"isp"`
}

type Location struct {
	Country     string  `json:"country"`
	CountryCode string  `json:"country_code"`
	City        string  `json:"city"`
	State       string  `json:"state"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Timezone    string  `json:"timezone"`
}

type Risk struct {
	IsMobile     bool `json:"is_mobile"`
	IsVPN        bool `json:"is_vpn"`
	IsTor        bool `json:"is_tor"`
	IsProxy      bool `json:"is_proxy"`
	IsDatacenter bool `json:"is_datacenter"`
	IsAnonymous  bool `json:"is_anonymous"`
}

func Query(ctx context.Context, ip string) (*IPInfo, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("%s/%s", baseURL, ip), nil)
	if err != nil {
		return nil, err
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var info IPInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, err
	}

	return &info, nil
}
