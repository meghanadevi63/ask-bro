import google.generativeai as genai
import os
from google.api_core.exceptions import ResourceExhausted

# Set your API key (replace with your actual key)
API_KEY = "AIzaSyDJBzWGMWl_BKsXoLv2LP8e_H6XCde2SMk"
genai.configure(api_key=API_KEY)




def check_gemini():
    try:
        models = genai.list_models()
        for model in models:
            print(model.name)

        model = genai.GenerativeModel("models/gemini-2.0-flash")
        response = model.generate_content("Say a what skills a cse student need don't give options just say a list of skills i want to develop for my career")
        print("✅ API is working. Response:")
        print(response.text)
    except ResourceExhausted as e:
        print("❌ Quota exceeded (429 Too Many Requests). Please wait until it resets.")
        print(str(e))
    except Exception as e:
        print("⚠️ Something went wrong:")
        print(str(e))

# Run the check
check_gemini()

