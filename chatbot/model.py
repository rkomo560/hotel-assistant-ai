import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class AssistantHotel:
    def __init__(self, corpus_path):
        self.corpus = self.load_corpus(corpus_path)
        self.vectorizer = TfidfVectorizer()
        self.X = self.vectorizer.fit_transform(self.corpus)

    def load_corpus(self, path):
        if not os.path.exists(path):
            raise FileNotFoundError(f"Corpus file not found: {path}")
        with open(path, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f if line.strip()]
        return lines

    def repondre(self, question):
        question_vect = self.vectorizer.transform([question])
        scores = cosine_similarity(question_vect, self.X)
        idx = scores.argmax()
        return self.corpus[idx]

# Test rapide (à supprimer ou commenter dans l’application finale)
if __name__ == "__main__":
    assistant = AssistantHotel("data/corpus.txt")
    while True:
        q = input("Question: ")
        print("Réponse:", assistant.repondre(q))
