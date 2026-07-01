package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/rs/zerolog/log"
)

const (
	geminiBaseURL = "https://generativelanguage.googleapis.com/v1beta/models"
	geminiModel   = "gemini-flash-latest"
)

type GeminiClient struct {
	apiKey string
	http   *http.Client
}

func NewGeminiClient(apiKey string) *GeminiClient {
	return &GeminiClient{
		apiKey: apiKey,
		http:   &http.Client{Timeout: 30 * time.Second},
	}
}

type geminiRequest struct {
	Contents []struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"contents"`
}

type geminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
	UsageMetadata struct {
		TotalTokenCount int `json:"totalTokenCount"`
	} `json:"usageMetadata"`
	Error *struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
		Status  string `json:"status"`
	} `json:"error,omitempty"`
}

func (c *GeminiClient) Complete(ctx context.Context, prompt string) (string, int, error) {
	url := fmt.Sprintf("%s/%s:generateContent", geminiBaseURL, geminiModel)

	payload := geminiRequest{}
	payload.Contents = append(payload.Contents, struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	}{
		Parts: []struct {
			Text string `json:"text"`
		}{{Text: prompt}},
	})

	body, err := json.Marshal(payload)
	if err != nil {
		return "", 0, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return "", 0, err
	}
	req.Header.Set("X-goog-api-key", c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.http.Do(req)
	if err != nil {
		return "", 0, err
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", 0, err
	}

	if resp.StatusCode != http.StatusOK {
		log.Error().Int("http_status", resp.StatusCode).Str("body", string(raw)).Msg("gemini HTTP error")
		return "", 0, fmt.Errorf("gemini HTTP %d: %s", resp.StatusCode, string(raw))
	}

	var result geminiResponse
	if err := json.Unmarshal(raw, &result); err != nil {
		log.Error().Str("body", string(raw)).Msg("gemini unmarshal error")
		return "", 0, fmt.Errorf("gemini: could not parse response: %w", err)
	}

	if result.Error != nil {
		return "", 0, fmt.Errorf("gemini %d (%s): %s", result.Error.Code, result.Error.Status, result.Error.Message)
	}
	if len(result.Candidates) == 0 || len(result.Candidates[0].Content.Parts) == 0 {
		log.Error().Str("body", string(raw)).Msg("gemini empty candidates")
		return "", 0, fmt.Errorf("gemini: no content in response")
	}

	return result.Candidates[0].Content.Parts[0].Text, result.UsageMetadata.TotalTokenCount, nil
}
