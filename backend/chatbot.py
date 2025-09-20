import gradio as gr
import openai

openai.api_key="YOUR_OPENAI_KEY"

def answer_query(query):
    response=openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Placement preparation question: {query}",
        max_tokens=200
    )
    return response.choices[0].text

gr.Interface(answer_query,"text","text",title="Placement AI Chatbot").launch(share=True)
