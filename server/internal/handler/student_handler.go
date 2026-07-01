package handler

import (
	"errors"
	"net/http"

	"github.com/rs/zerolog/log"

	"server/internal/service"
)

type StudentHandler struct {
	students *service.StudentService
}

func NewStudentHandler(students *service.StudentService) *StudentHandler {
	return &StudentHandler{students: students}
}

func (h *StudentHandler) List(w http.ResponseWriter, r *http.Request) {
	items, err := h.students.List(r.Context())
	if err != nil {
		log.Error().Err(err).Msg("students.list")
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	writeJSON(w, http.StatusOK, items)
}

func (h *StudentHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "missing id")
		return
	}

	detail, err := h.students.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrStudentNotFound) {
			writeError(w, http.StatusNotFound, "student not found")
			return
		}
		log.Error().Err(err).Str("id", id).Msg("students.getByID")
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	writeJSON(w, http.StatusOK, detail)
}

func (h *StudentHandler) Assess(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "missing id")
		return
	}

	result, err := h.students.Assess(r.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrStudentNotFound) {
			writeError(w, http.StatusNotFound, "student not found")
			return
		}
		log.Error().Err(err).Str("id", id).Msg("students.assess")
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	writeJSON(w, http.StatusCreated, result)
}
