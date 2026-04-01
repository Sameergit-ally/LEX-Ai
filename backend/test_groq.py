import asyncio
from services.llm_service import chat_completion_json
from routes.rescue import SYSTEM_PROMPT

async def test():
    user_message_content = "Problem Description: My employer has not paid my salary for the last 3 months and is threatening to terminate me if I complain."
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message_content}
    ]
    
    try:
        response_json = await chat_completion_json(messages)
        import json
        print("SUCCESS:")
        print(json.dumps(response_json, indent=2))
        
        # Check if severity is present
        if "severity" not in response_json:
            print("\nWARNING: 'severity' is missing from the JSON!")
            
    except Exception as e:
        print("ERROR:", str(e))

asyncio.run(test())
