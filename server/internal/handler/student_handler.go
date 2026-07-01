package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/rs/zerolog/log"

	"server/internal/dto"
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

func (h *StudentHandler) Create(w http.ResponseWriter, r *http.Request) {
	var in dto.CreateStudentInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		writeError(w, http.StatusBadRequest, "invalid body")
		return
	}
	if in.Name == "" || in.SchoolName == "" || in.Zone == "" || in.EducationLevel == "" || in.Grade == 0 {
		writeError(w, http.StatusBadRequest, "name, school_name, zone, education_level and grade are required")
		return
	}

	item, err := h.students.Create(r.Context(), in)
	if err != nil {
		log.Error().Err(err).Msg("students.create")
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	writeJSON(w, http.StatusCreated, item)
}

func (h *StudentHandler) UpsertRecord(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "missing id")
		return
	}

	var in dto.UpsertRecordInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		writeError(w, http.StatusBadRequest, "invalid body")
		return
	}
	if in.Term < 1 || in.Term > 4 {
		writeError(w, http.StatusBadRequest, "term must be between 1 and 4")
		return
	}

	if err := h.students.UpsertRecord(r.Context(), id, in); err != nil {
		if errors.Is(err, service.ErrStudentNotFound) {
			writeError(w, http.StatusNotFound, "student not found")
			return
		}
		log.Error().Err(err).Str("id", id).Msg("students.upsertRecord")
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
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
