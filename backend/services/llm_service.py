from dotenv import load_dotenv
load_dotenv()

"""
LLM Service — all Groq LLM calls go through here.
Uses llama3-70b-8192 model.
"""

import os
import json
import traceback
from groq import Groq

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL = "llama-3.3-70b-versatile"

client = Groq(api_key=GROQ_API_KEY)


async def chat_completion(messages: list[dict], temperature: float = 0.4, max_tokens: int = 1024) -> str:
    """
    Send messages to Groq LLM and return the assistant reply.
    messages: list of {"role": "system"|"user"|"assistant", "content": "..."}
    """
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq error: {e}")
        traceback.print_exc()
        raise RuntimeError(f"Groq LLM call failed: {str(e)}")


async def chat_completion_json(messages: list[dict], temperature: float = 0.2) -> dict:
    """
    Send messages and parse the reply as JSON.
    Falls back to raw string wrapped in a dict on parse failure.
    """
    raw = await chat_completion(messages, temperature=temperature, max_tokens=2048)
    try:
        # Strip markdown code fences if present
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {"raw_response": raw}

