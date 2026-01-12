import { WritingFeedback, FeedbackScores } from "./types";

// 模拟 AI 评价反馈的生成逻辑
// Mock AI feedback generation - structured for easy replacement with real API calls
// 实际使用时，可以将此函数替换为调用 OpenAI 或 Claude API 的请求
// In production, replace this function with actual OpenAI/Claude API calls

// 暖心评语模板（正向鼓励）
const encouragementTemplates = [
  "您的文字中透着一种独特的生命力，让人读来心生暖意。",
  "这篇写作展现了您细腻的观察力，许多细节描写令人印象深刻。",
  "您的表达真诚而富有感染力，字里行间流露出真实的情感。",
  "这篇文字有一种安静的力量，让人愿意静下心来细细品味。",
  "您的文字功底扎实，能够准确捕捉并传达内心的感受。",
  "这篇文章的结构很有层次感，逐步展开的叙述引人入胜。",
  "您的语言富有节奏感，读起来像一首温柔的小诗。",
  "从文字中能感受到您的思考深度，这种内省的态度很珍贵。"
];

// 改进建议模板（温柔且具体）
const suggestionTemplates = [
  "可以尝试在关键场景中加入更多感官描写，比如气味、触觉，这样会让读者更有代入感。",
  "某些段落可以稍微放慢节奏，给读者更多的想象空间和思考时间。",
  "考虑在文中加入一些对比手法，比如过去与现在、动与静，这样会让文章更有张力。",
  "有些句子可以更精炼一些，去掉多余的修饰词，让文字更有力量。",
  "可以尝试用一个贯穿全文的意象作为线索，这样文章会更加紧密有序。",
  "在情感高潮的部分，可以尝试用更直接的表达，让情感更加饱满。",
  "可以加入一些具体的小细节，比如一个物品、一个动作，让抽象的情感变得可感可知。"
];

// 生成随机分数（模拟 AI 评分）
function generateRandomScores(): FeedbackScores {
  return {
    creativity: Math.floor(Math.random() * 15) + 75, // 75-90
    emotion: Math.floor(Math.random() * 20) + 70,     // 70-90
    expression: Math.floor(Math.random() * 15) + 75,  // 75-90
    logic: Math.floor(Math.random() * 20) + 70,       // 70-90
    vocabulary: Math.floor(Math.random() * 15) + 75   // 75-90
  };
}

// 从文本中随机选择一句进行润色
function extractAndImproveSentence(content: string): { original: string; improved: string } | undefined {
  const sentences = content.split(/[。！？；]/).filter(s => s.trim().length > 10);
  if (sentences.length === 0) return undefined;

  const randomSentence = sentences[Math.floor(Math.random() * sentences.length)].trim();
  const original = randomSentence;

  // 模拟润色：添加一些修饰和细节
  const improvements = [
    (s: string) => s.replace(/很/g, "格外"),
    (s: string) => s.replace(/觉得/g, "深感"),
    (s: string) => s.replace(/看/g, "凝视"),
    (s: string) => `${s}，仿佛时间在此刻凝固`,
    (s: string) => `这一刻，${s}`
  ];

  const improved = improvements[Math.floor(Math.random() * improvements.length)](original);

  return { original, improved };
}

// 主函数：生成写作反馈
// Main function: generate writing feedback
export async function generateWritingFeedback(
  content: string,
  topicPrompt: string
): Promise<WritingFeedback> {
  // 模拟 API 延迟
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const scores = generateRandomScores();
  const encouragement = encouragementTemplates[Math.floor(Math.random() * encouragementTemplates.length)];

  // 随机选择 1-2 条建议
  const shuffledSuggestions = [...suggestionTemplates].sort(() => Math.random() - 0.5);
  const suggestions = shuffledSuggestions.slice(0, Math.floor(Math.random() * 2) + 1);

  const improvedSentence = extractAndImproveSentence(content);

  return {
    scores,
    encouragement,
    suggestions,
    improvedSentence
  };
}

// 为后续接入真实 API 预留的接口函数
// Reserved interface for real API integration
export async function generateWritingFeedbackWithAPI(
  content: string,
  topicPrompt: string,
  apiKey: string
): Promise<WritingFeedback> {
  // TODO: 在这里实现真实的 API 调用
  // TODO: Implement real API call here
  // 示例结构：
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是一位温柔且专业的写作导师...'
        },
        {
          role: 'user',
          content: `题目：${topicPrompt}\n\n学员作文：\n${content}\n\n请提供正向反馈...`
        }
      ]
    })
  });
  */

  return generateWritingFeedback(content, topicPrompt);
}
