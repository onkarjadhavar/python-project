import re
import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template, request

app = Flask(__name__)
app.config["SECRET_KEY"] = "change-this-key"

STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but",
    "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
    "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
    "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "me",
    "more", "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only",
    "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she",
    "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them",
    "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too",
    "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which",
    "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself",
    "yourselves"
}


def extract_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "header", "footer", "nav", "aside", "form"]):
        tag.extract()
    text = soup.get_text(separator=" ")
    lines = [line.strip() for line in text.splitlines()]
    chunks = [chunk.strip() for line in lines for chunk in line.split("  ") if chunk.strip()]
    return " ".join(chunks)


def tokenize_sentences(text: str) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [sentence.strip() for sentence in sentences if len(sentence.strip()) > 20]


def clean_words(text: str) -> list[str]:
    cleaned = re.sub(r"[^a-zA-Z0-9']", " ", text).lower()
    return [word for word in cleaned.split() if word and word not in STOP_WORDS]


def summarize_text(text: str, sentence_count: int = 4) -> list[str]:
    sentences = tokenize_sentences(text)
    if len(sentences) <= sentence_count:
        return sentences

    frequencies: dict[str, float] = {}
    for word in clean_words(text):
        frequencies[word] = frequencies.get(word, 0.0) + 1.0

    if not frequencies:
        return []

    max_frequency = max(frequencies.values())
    for word in frequencies:
        frequencies[word] /= max_frequency

    sentence_scores: dict[str, float] = {}
    for sentence in sentences:
        for word in clean_words(sentence):
            sentence_scores[sentence] = sentence_scores.get(sentence, 0.0) + frequencies.get(word, 0.0)

    ranked_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)
    return ranked_sentences[:sentence_count]


@app.route("/", methods=["GET", "POST"])
def index():
    summary: list[str] = []
    page_url = ""
    error = None

    if request.method == "POST":
        page_url = request.form.get("url", "").strip()
        if not page_url:
            error = "Enter a website URL to summarize."
        else:
            if not re.match(r"^https?://", page_url, re.I):
                page_url = "http://" + page_url
            try:
                response = requests.get(page_url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
                response.raise_for_status()
                page_text = extract_text(response.text)
                summary = summarize_text(page_text)
                if not summary:
                    error = "Could not generate a summary from the page content. Try another URL."
            except requests.RequestException as exc:
                error = f"Unable to fetch the page: {exc}"

    return render_template("index.html", url=page_url, summary=summary, error=error)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
