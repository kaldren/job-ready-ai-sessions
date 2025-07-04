
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { jobTitle, jobLevel, jobIndustry, question, answer, language = 'en', languageName = 'English' } = await req.json()
    
    if (!answer || answer.trim().length < 10) {
      return new Response(
        JSON.stringify({ feedback: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found')
    }

    const languageInstruction = language !== 'en' ? 
      `Provide your feedback in ${languageName} language. Use natural, professional ${languageName}.` :
      '';

    const prompt = `You are an experienced interview coach providing instant, constructive feedback on interview answers.

${languageInstruction}

Role Context:
- Job Title: ${jobTitle}
- Experience Level: ${jobLevel}
- Industry: ${jobIndustry}

Interview Question: "${question}"

Candidate's Answer: "${answer}"

Provide brief, actionable feedback (2-3 sentences max) focusing on:
1. What they did well
2. One specific area for improvement
3. A quick tip to strengthen their response

Keep it encouraging and constructive. Don't repeat the question or answer back.`

    console.log('Generating instant feedback for:', { jobTitle, jobLevel, jobIndustry, language });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert interview coach. Provide concise, actionable feedback that helps candidates improve their interview performance. ${languageInstruction}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const feedback = data.choices[0]?.message?.content

    if (!feedback) {
      throw new Error('No feedback generated')
    }

    console.log('Generated instant feedback successfully in', languageName);

    return new Response(
      JSON.stringify({ feedback }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-instant-feedback function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
