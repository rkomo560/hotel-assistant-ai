import os
from flask import Flask, render_template, request, jsonify
from chatbot.model import AssistantHotel

app = Flask(__name__)
assistant = AssistantHotel("data/corpus.txt")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "")
    if question.strip() == "":
        return jsonify({"answer": "Veuillez poser une question."})

    reponse = assistant.repondre(question)
    return jsonify({"answer": reponse})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
