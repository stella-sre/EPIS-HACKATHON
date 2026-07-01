package handler

import (
	"errors"
	"net/http"

	"github.com/rs/zerolog/log"

	"server/internal/service"
)

type RecommendationHandler struct {
	recommendations *service.RecommendationService
}

func NewRecommendationHandler(recommendations *service.RecommendationService) *RecommendationHandler {
	return &RecommendationHandler{recommendations: recommendations}
}

func (h *RecommendationHandler) List(w http.ResponseWriter, r *http.Request) {
	items, err := h.recommendations.List(r.Context())
	if err != nil {
		log.Error().Err(err).Msg("recommendations.list")
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	writeJSON(w, http.StatusOK, items)
}

func (h *RecommendationHandler) Generate(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "missing id")
		return
	}

	result, err := h.recommendations.Generate(r.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrStudentNotFound) {
			writeError(w, http.StatusNotFound, "student not found")
			return
		}
		log.Error().Err(err).Str("id", id).Msg("recommend.generate")
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, result)
}
