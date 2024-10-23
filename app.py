from flask import Flask, request, render_template
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import pickle

# Load the Keras model
model = load_model('model_spam.keras')

# Load the tokenizer from JSON
with open('tokenizer.pkl', 'rb') as f:
    tokenizer = pickle.load(f)

# Define the max length (ensure this matches the maxlen used during training)
max_len = 100  # Change this based on the max_len used when training your model



def is_spam(email):
    # Tokenize and pad the input email text
    email_seq = tokenizer.texts_to_sequences([email])
    email_pad = pad_sequences(email_seq, maxlen=max_len)
    
    # Predict using the Keras model
    prediction = model.predict(email_pad)
    
    # Convert the prediction to "Spam" or "Not Spam"
    return "Spam" if prediction[0][0] > 0.5 else "Not Spam"

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Extract text data from form
    text = request.form['Text']
    
    # Make prediction using the is_spam function
    sentiment = is_spam(text)
    
    # Render the result on the same page
    return render_template('index.html', prediction_text=f"Sentiment: '{sentiment}'")

if __name__ == "__main__":
    app.run(debug=True)