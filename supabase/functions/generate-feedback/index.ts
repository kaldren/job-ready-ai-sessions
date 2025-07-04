
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuestionAnswer {
  question: string;
  answer: string;
  timeSpent: number;
}

interface FeedbackRequest {
  jobTitle: string;
  level: string;
  industry: string;
  questions: QuestionAnswer[];
  totalTime: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitle, level, industry, questions, totalTime }: FeedbackRequest = await req.json();

    console.log('Feedback request received:', { jobTitle, level, industry, questionCount: questions.length });

    if (!jobTitle || !level || !industry || !questions || questions.length === 0) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format questions and answers for analysis
    const qaText = questions.map((qa, index) => 
      `Question ${index + 1}: ${qa.question}\nAnswer: ${qa.answer}\nTime spent: ${Math.floor(qa.timeSpent / 1000)} seconds\n`
    ).join('\n---\n\n');

    const totalMinutes = Math.floor(totalTime / 1000 / 60);

    const prompt = `You are an expert interview coach analyzing a ${level} level ${jobTitle} interview in the ${industry} industry.

Interview Details:
- Position: ${jobTitle}
- Level: ${level}
- Industry: ${industry}
- Total Time: ${totalMinutes} minutes
- Questions Answered: ${questions.length}

Here are the questions and answers:

${qaText}

Please provide a comprehensive interview feedback analysis in JSON format with the following structure:

{
  "overallScore": number (0-100),
  "scores": {
    "communication": number (0-100),
    "content": number (0-100),
    "confidence": number (0-100)
  },
  "strengths": [
    "string describing a specific strength observed",
    "string describing another strength",
    "string describing a third strength"
  ],
  "improvements": [
    "string describing a specific area for improvement",
    "string describing another improvement area", 
    "string describing a third improvement area"
  ],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed recommendation description"
    },
    {
      "title": "Another recommendation title", 
      "description": "Another detailed recommendation"
    },
    {
      "title": "Third recommendation title",
      "description": "Third detailed recommendation"
    },
    {
      "title": "Fourth recommendation title",
      "description": "Fourth detailed recommendation"
    }
  ]
}

Base your analysis on:
1. Quality and relevance of answers to the ${jobTitle} role
2. Communication clarity and structure
3. Use of specific examples and metrics
4. Industry knowledge demonstrated
5. Confidence and professionalism
6. Time management (average time per question)
7. Depth of responses appropriate for ${level} level

Provide constructive, actionable feedback that will help the candidate improve for future interviews.`;

    console.log('Making OpenAI API request for feedback analysis...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert interview coach and HR professional. Always respond with valid JSON containing detailed interview feedback.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }
      
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('OpenAI API response received successfully');
    
    const generatedContent = data.choices[0].message.content;
    console.log('Generated feedback content preview:', generatedContent?.substring(0, 200));

    // Parse the JSON response
    let feedback;
    try {
      // Clean up the response in case there's extra text
      const cleanContent = generatedContent.trim();
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : cleanContent;
      
      feedback = JSON.parse(jsonString);
      console.log('Successfully parsed feedback');
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Raw content:', generatedContent);
      return new Response(
        JSON.stringify({ error: 'Failed to parse feedback from OpenAI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate the feedback structure
    if (!feedback.overallScore || !feedback.scores || !feedback.strengths || !feedback.improvements || !feedback.recommendations) {
      console.error('Invalid feedback structure:', feedback);
      return new Response(
        JSON.stringify({ error: 'Invalid feedback structure from OpenAI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully generated personalized feedback');

    return new Response(
      JSON.stringify({ feedback }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in generate-feedback function:', error);
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
