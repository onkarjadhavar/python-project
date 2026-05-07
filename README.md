# Webpage Summarizer

A simple Flask web app that fetches a webpage, extracts visible text, and returns a short summary.

## Install

1. Open a terminal in `d:\webpage summarise.py`
2. Create a virtual environment (optional but recommended):
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

## Run

```powershell
python app.py
```

Then open `http://127.0.0.1:5000` in your browser.

## Usage

- Paste a website URL into the form
- Click `Summarize`
- The app returns a short summary extracted from the page text

## Notes

- This summarizer uses a simple frequency-based algorithm and works best on pages with readable article text.
- If a site blocks scraping or requires JavaScript, the summary may fail.
























...../