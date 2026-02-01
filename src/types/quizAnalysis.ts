export interface AnalyzeQuizRequest {
  quiz_id: string;
  description: string;
}

/**
 * Analysis summary from AI
 * Note: API may return different field names, so we support both
 */
export interface AnalysisSummary {
  total_questions: number;
  total_points: number;
  // Difficulty field - API may use either name
  overall_difficulty?: string;
  average_difficulty?: string;
  // Subject/Focus fields
  subject?: string;
  focus?: string;
  coverage?: string;
  // Description alignment field - API may use either name
  description_alignment?: string;
  description_match?: string;
  time_allocated?: string;
}

/**
 * Bloom's Taxonomy distribution
 */
export interface BloomDistribution {
  "Nhận biết": number;
  "Thông hiểu": number;
  "Vận dụng": number;
  "Phân tích": number;
  "Đánh giá": number;
  "Sáng tạo": number;
}

/**
 * Individual question evaluation
 */
export interface QuestionEvaluation {
  id: string;
  knowledge_point: string;
  bloom_level: string;
  difficulty_level: string;
  clarity_score: number;
  content_relevance_score: number;
  overall_score: number;
  comments: string;
  topic?: string;
}

/**
 * AI recommendation with optional example question
 */
export interface AIRecommendation {
  recommendation: string;
  rationale?: string;
  example_question?: {
    content: string;
    type: string;
    point: number;
    answer: string[];
    correct_answer: string;
    difficulty: string;
  };
}

/**
 * Analysis metadata
 */
export interface AnalysisMetadata {
  quiz_id: string;
  quiz_title: string;
  analyzed_at: string;
  chatId?: string;
  conversationId?: string;
}

/**
 * Full quiz analysis data
 */
export interface QuizAnalysisData {
  analysis_summary: AnalysisSummary;
  bloom_distribution: BloomDistribution;
  question_evaluation: QuestionEvaluation[];
  knowledge_gaps: string[];
  ai_recommendations: AIRecommendation[] | string[];
}

/**
 * API response for quiz analysis
 */
export interface AnalyzeQuizResponse {
  success: boolean;
  message: string;
  data: QuizAnalysisData;
  metadata: AnalysisMetadata;
}

/**
 * Stored analysis in localStorage
 */
export interface StoredQuizAnalysis {
  quizId: string;
  analysis: QuizAnalysisData;
  metadata: AnalysisMetadata;
  storedAt: string;
}
