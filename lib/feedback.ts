import { WritingFeedback } from "./types";

// 主函数：生成写作反馈（使用真实的 AI API）
// Main function: generate writing feedback using real AI API
export async function generateWritingFeedback(
  content: string,
  topicPrompt: string
): Promise<WritingFeedback> {
  try {
    const response = await fetch('/api/ai/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        topicPrompt,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.feedback
  } catch (error) {
    console.error('Error calling feedback API:', error)
    throw error
  }
}
