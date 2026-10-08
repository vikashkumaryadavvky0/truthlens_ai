# streamlit_app.py
import streamlit as st
import joblib
from nlp_pipeline import clean_text

st.set_page_config(page_title="TruthLens AI", page_icon="🛡️", layout="centered")

model = joblib.load('model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

st.title("🛡️ TruthLens AI")
st.subheader("Fake News & Credibility Detector")

user_input = st.text_area("Paste News Text Here:", height=200)

if st.button("Analyze Credibility", type="primary"):
    if user_input.strip():
        cleaned = clean_text(user_input)
        vec = vectorizer.transform([cleaned])
        pred = model.predict(vec)[0]
        
        if pred == 0:
            st.success("✅ Prediction: REAL / RELIABLE NEWS")
        else:
            st.error("🚨 Prediction: FAKE / UNRELIABLE NEWS")
    else:
        st.warning("Please enter text to analyze.")