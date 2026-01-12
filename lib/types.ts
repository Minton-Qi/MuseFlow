// Writing prompt topics
export interface Topic {
  id: string;
  title: string;
  prompt: string;
  category: "imagination" | "emotion" | "reflection" | "creative" | "philosophical";
  inspiration: {
    angles: string[];
    examples: string[];
  };
}

// Feedback dimensions
export interface FeedbackScores {
  creativity: number;    // 创意
  emotion: number;       // 情感
  expression: number;    // 表达
  logic: number;         // 逻辑
  vocabulary: number;    // 词汇
}

export interface WritingFeedback {
  scores: FeedbackScores;
  encouragement: string;
  suggestions: string[];
  improvedSentence?: {
    original: string;
    improved: string;
  };
}

export interface WritingSession {
  topicId: string;
  content: string;
  wordCount: number;
  startTime: Date;
  endTime?: Date;
}
