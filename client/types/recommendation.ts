import { RiskDTO } from "./student"

export interface RecommendationResponse {
  id: string
  student_id: string
  assessment_id?: string
  explanation: string
  suggested_action: string
  generated_at: string
  risk: RiskDTO
}
