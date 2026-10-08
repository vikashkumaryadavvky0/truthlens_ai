from flask import Flask, render_template, request, jsonify
import joblib
from nlp_pipeline import clean_text

app = Flask(__name__)

# Load model and vectorizer
model = joblib.load('model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json() or {}
    text_content = data.get('text', '')
    url_content = data.get('url', '')

    input_text = text_content if text_content.strip() else url_content

    if not input_text:
        return jsonify({'error': 'No input text provided'}), 400

    # 1. Preprocess input text
    cleaned_input = clean_text(input_text)

    # 2. Vectorize text
    vec_data = vectorizer.transform([cleaned_input])

    # 3. Calculate score & prediction
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(vec_data)[0]
        # Assuming index 1 represents Real / Reliable news
        score = round(float(probabilities[1]) * 100, 1)
    else:
        # Fallback for algorithms without predict_proba (e.g., PassiveAggressiveClassifier)
        prediction_val = model.predict(vec_data)[0]
        score = 92.0 if int(prediction_val) == 1 else 18.0

    is_real = score >= 50.0
    label = "REAL / RELIABLE" if is_real else "FAKE / UNRELIABLE"

    # 4. Return matching JSON output
    return jsonify({
        'credibility_score': score,
        'is_real': is_real,
        'prediction': label
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)