# nlp_pipeline.py
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Ensure required NLTK resources are downloaded
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def clean_text(text: str) -> str:
    """
    Cleans, lowercases, removes punctuation/numbers/stopwords, 
    and lemmatizes input news text matching training pipeline.
    """
    if not isinstance(text, str) or not text.strip():
        return ""
    
    # 1. Lowercased text
    text = text.lower()
    
    # 2. Remove URLs, HTML tags, special chars, and numbers
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), ' ', text)
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'\w*\d\w*', '', text)
    
    # 3. Tokenize, remove stopwords, and lemmatize
    tokens = text.split()
    cleaned_tokens = [
        lemmatizer.lemmatize(word) 
        for word in tokens 
        if word not in stop_words and len(word) > 2
    ]
    
    return " ".join(cleaned_tokens)