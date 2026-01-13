import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.BIGMODEL_API_KEY
const BASE_URL = process.env.BIGMODEL_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4'

interface FeedbackRequest {
  content: string
  topicPrompt: string
}

interface FeedbackScores {
  creativity: number
  emotion: number
  expression: number
  logic: number
  vocabulary: number
}

interface ImprovedSentence {
  original: string
  improved: string
}

interface WritingFeedback {
  scores: FeedbackScores
  encouragement: string
  suggestions: string[]
  improvedSentence?: ImprovedSentence
}

function extractJSONFromResponse(text: string): WritingFeedback | null {
  // Try to find JSON in the response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null

  try {
    const parsed = JSON.parse(jsonMatch[0])

    // Validate the structure
    if (
      parsed.scores &&
      parsed.encouragement &&
      Array.isArray(parsed.suggestions)
    ) {
      return {
        scores: {
          creativity: Number(parsed.scores.creativity) || 80,
          emotion: Number(parsed.scores.emotion) || 80,
          expression: Number(parsed.scores.expression) || 80,
          logic: Number(parsed.scores.logic) || 80,
          vocabulary: Number(parsed.scores.vocabulary) || 80,
        },
        encouragement: String(parsed.encouragement),
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        improvedSentence: parsed.improvedSentence,
      }
    }
  } catch (e) {
    console.error('Failed to parse JSON from AI response:', e)
  }

  return null
}

function generateFallbackFeedback(content: string, topicPrompt: string): WritingFeedback {
  const wordCount = content.replace(/\s/g, '').length
  const baseScore = Math.min(85 + Math.floor(wordCount / 50), 95)

  return {
    scores: {
      creativity: baseScore + Math.floor(Math.random() * 10),
      emotion: baseScore + Math.floor(Math.random() * 10),
      expression: baseScore + Math.floor(Math.random() * 10),
      logic: baseScore + Math.floor(Math.random() * 10),
      vocabulary: baseScore + Math.floor(Math.random() * 10),
    },
    encouragement: '您的文字展现了真诚的表达和细腻的思考，每一篇作品都是内心世界的真实映照。',
    suggestions: [
      '可以尝试在关键场景中加入更多感官描写，让读者更有代入感。',
      '某些段落可以放慢节奏，给读者更多想象空间。',
      '尝试用对比手法会让文章更有张力。',
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, topicPrompt }: FeedbackRequest = await request.json()

    if (!content || !topicPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: content and topicPrompt' },
        { status: 400 }
      )
    }

    if (!API_KEY) {
      console.error('BIGMODEL_API_KEY is not configured')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const systemPrompt = `你是一位温柔、专业且富有洞察力的写作导师。你的任务是：
1. 分析学员的写作，从五个维度评分（0-100分）：创意、情感、表达、逻辑、词汇
2. 提供一段温暖、真诚的鼓励（30-60字）
3. 给出1-3条具体、可操作的改进建议（每条15-40字）
4. 从文中选择一句有潜力的句子进行润色（可选）

请以JSON格式回复，结构如下：
{
  "scores": {
    "creativity": 数字,
    "emotion": 数字,
    "expression": 数字,
    "logic": 数字,
    "vocabulary": 数字
  },
  "encouragement": "鼓励文本",
  "suggestions": ["建议1", "建议2", "建议3"],
  "improvedSentence": {
    "original": "原句",
    "improved": "润色后的句子"
  }
}

注意：
- 评分要公正且鼓励为主，70-95分为宜
- 鼓励要真诚具体，避免空洞
- 建议要实用、可操作
- 润色要保留原意，提升表达质量
- 必须返回纯JSON格式，不要有其他文字`

    const userPrompt = `题目：${topicPrompt}

学员作文：
${content}

请分析这篇写作并提供反馈。`

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('BigModel API error:', response.status, errorText)

      // Return fallback feedback on API error
      const fallback = generateFallbackFeedback(content, topicPrompt)
      return NextResponse.json({ feedback: fallback, fallback: true })
    }

    const data = await response.json()
    const aiContent = data.choices?.[0]?.message?.content

    if (!aiContent) {
      console.error('Invalid API response structure:', data)
      const fallback = generateFallbackFeedback(content, topicPrompt)
      return NextResponse.json({ feedback: fallback, fallback: true })
    }

    // Try to extract JSON from the response
    const feedback = extractJSONFromResponse(aiContent)

    if (!feedback) {
      console.error('Could not extract valid JSON from AI response:', aiContent)
      const fallback = generateFallbackFeedback(content, topicPrompt)
      return NextResponse.json({ feedback: fallback, fallback: true })
    }

    // Validate scores are within range
    Object.keys(feedback.scores).forEach((key) => {
      const score = feedback.scores[key as keyof FeedbackScores]
      if (score < 0 || score > 100 || isNaN(score)) {
        feedback.scores[key as keyof FeedbackScores] = 80
      }
    })

    return NextResponse.json({ feedback, fallback: false })
  } catch (error) {
    console.error('Error generating feedback:', error)

    const { content, topicPrompt }: FeedbackRequest = await request.json()
    const fallback = generateFallbackFeedback(content, topicPrompt)

    return NextResponse.json(
      { feedback: fallback, fallback: true, error: 'Failed to generate AI feedback' },
      { status: 200 } // Return 200 with fallback to not break the app
    )
  }
}
