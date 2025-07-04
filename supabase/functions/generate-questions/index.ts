
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitle, level, industry } = await req.json();

    console.log('Request received:', { jobTitle, level, industry });

    if (!jobTitle || !level || !industry) {
      console.error('Missing required fields:', { jobTitle, level, industry });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: jobTitle, level, industry' }),
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

    console.log('Generating questions for:', { jobTitle, level, industry });

    const prompt = `You are an expert interviewer creating a comprehensive interview for a ${level} level ${jobTitle} position in the ${industry} industry.

Generate exactly 35 interview questions that are:
1. Appropriate for the ${level} experience level
2. Specific to the ${jobTitle} role
3. Relevant to the ${industry} industry
4. Progressive in difficulty and depth
5. Cover both technical and behavioral aspects

Include a mix of:
- Role-specific technical questions
- Behavioral/situational questions  
- Industry-specific challenges
- Leadership questions (for senior roles)
- Problem-solving scenarios
- Cultural fit questions

Format your response as a JSON array of strings, with each string being a complete interview question. Do not include any other text or formatting - just the JSON array.

Example format: ["Question 1 here", "Question 2 here", ...]`;

    console.log('Making OpenAI API request...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert interview coach and HR professional. Always respond with valid JSON arrays of interview questions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
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
    console.log('Generated content length:', generatedContent?.length);
    console.log('Generated content preview:', generatedContent?.substring(0, 200));

    // Parse the JSON response
    let questions;
    try {
      // Clean up the response in case there's extra text
      const cleanContent = generatedContent.trim();
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : cleanContent;
      
      questions = JSON.parse(jsonString);
      console.log('Successfully parsed questions, count:', questions.length);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Raw content:', generatedContent);
      return new Response(
        JSON.stringify({ error: 'Failed to parse questions from OpenAI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(questions)) {
      console.error('OpenAI response is not an array:', typeof questions);
      return new Response(
        JSON.stringify({ error: 'OpenAI response is not an array of questions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully generated ${questions.length} questions`);

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in generate-questions function:', error);
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
