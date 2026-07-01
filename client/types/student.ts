export type RiskLevel = "low" | "medium" | "high"

export interface RiskDTO {
  level: RiskLevel
  reasons: string[]
}

export interface RecordDTO {
  term: number
  attendance_pct: number
  grade_avg: number
  participation: number
}

export interface StudentListItem {
  id: string
  name: string
  school_name: string
  zone: "rural" | "urban"
  education_level: "primary" | "secondary"
  grade: number
  native_language: string
  risk: RiskDTO
}

export interface DistrictDTO {
  name: string
  department: string
  primary_dropout_rate: number
  secondary_dropout_rate: number
}

export interface StudentDetail extends StudentListItem {
  district: DistrictDTO
  records: RecordDTO[]
}

export interface AssessResponse {
  id: string
  student_id: string
  risk_level: RiskLevel
  reasons: string[]
  assessed_at: string
}
