package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const (
	minimaxURL   = "https://api.minimax.chat/v1/chat/completions"
	minimaxModel = "MiniMax-Text-01"
)

type MinimaxClient struct {
	apiKey string
	http   *http.Client
}

func NewMinimaxClient(apiKey string) *MinimaxClient {
	return &MinimaxClient{
		apiKey: apiKey,
		http:   &http.Client{Timeout: 30 * time.Second},
	}
}

type mmMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type mmRequest struct {
	Model     string      `json:"model"`
	Messages  []mmMessage `json:"messages"`
	MaxTokens int         `json:"max_tokens"`
}

type mmResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
	Usage struct {
		TotalTokens int `json:"total_tokens"`
	} `json:"usage"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

func (c *MinimaxClient) Complete(ctx context.Context, prompt string) (string, int, error) {
	body, err := json.Marshal(mmRequest{
		Model:     minimaxModel,
		MaxTokens: 1024,
		Messages:  []mmMessage{{Role: "user", Content: prompt}},
	})
	if err != nil {
		return "", 0, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, minimaxURL, bytes.NewReader(body))
	if err != nil {
		return "", 0, err
	}
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
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

	var result mmResponse
	if err := json.Unmarshal(raw, &result); err != nil {
		return "", 0, err
	}

	if result.Error != nil {
		return "", 0, fmt.Errorf("minimax: %s", result.Error.Message)
	}
	if len(result.Choices) == 0 {
		return "", 0, fmt.Errorf("minimax: empty response")
	}

	return result.Choices[0].Message.Content, result.Usage.TotalTokens, nil
}
