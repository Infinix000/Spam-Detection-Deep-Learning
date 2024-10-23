
# Spam Detection Using Deep Learning

This repository contains a deep learning model built using Keras and TensorFlow to classify email messages as "Spam" or "Not Spam." The project is implemented using a Flask web application to provide a user-friendly interface for real-time predictions.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Model Training](#model-training)
- [Technologies Used](#technologies-used)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Overview

This project aims to detect spam emails using a deep learning approach. We train a Keras neural network model on labeled data to predict whether a given email is "Spam" or "Not Spam." The model is then integrated into a Flask web application where users can input email text and receive a spam detection result.

## Features

- Uses a Keras-based deep learning model for spam classification.
- Flask web application with a user-friendly interface.
- Provides real-time spam detection for user input.
- JSON-based tokenizer for consistent input vectorization.
- Integration of pre-trained deep learning models for inference.

## Installation

To run this project locally, follow these steps:

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/Infinix000/Spam-Detection-Deep-Learning.git
cd Spam-Detection-Deep-Learning
\`\`\`

### 2. Create a Python virtual environment and activate it

\`\`\`bash
python -m venv myenv
source myenv/bin/activate  # For Linux/Mac
# or
myenv\Scripts\activate  # For Windows
\`\`\`

### 3. Install the required dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Download the model and tokenizer

Ensure you have the trained \`model_spam.keras\` and \`tokenizer.json\` files in the project directory. If you haven't trained the model yet, see [Model Training](#model-training).

### 5. Run the Flask application

\`\`\`bash
python app.py
\`\`\`

By default, the Flask app runs on \`http://127.0.0.1:5000/\`.

## Usage

1. Navigate to the Flask web interface at \`http://127.0.0.1:5000/\`.
2. Enter the email content in the provided text box.
3. Click on the **Analyze Sentiment** button to get the result (either "Spam" or "Not Spam").

## Project Structure

\`\`\`
├── app.py                    # Main Flask application
├── model_spam.keras          # Trained Keras model
├── tokenizer.json            # Tokenizer for text preprocessing
├── requirements.txt          # Python dependencies
├── static/                   # Static assets (CSS, JS, etc.)
├── templates/                # HTML templates for the Flask app
└── README.md                 # Project documentation
\`\`\`

## Model Training

If you want to retrain the spam detection model, you can follow these steps:

1. **Prepare the Dataset**: Use a dataset with labeled email data for spam and not spam. You can use datasets like the [SpamAssassin dataset](https://spamassassin.apache.org/publiccorpus/) or [Kaggle datasets](https://www.kaggle.com/).
   
2. **Training the Model**: Create a Python script to train the deep learning model. Here’s a basic outline:
   - Use a tokenizer to preprocess email text.
   - Train a neural network model using Keras/TensorFlow.
   - Save the trained model using \`model.save('model_spam.keras')\`.

3. **Saving the Tokenizer**: Save the tokenizer to a JSON file for reuse during inference.

\`\`\`python
# Example for saving a tokenizer
import json
tokenizer_json = tokenizer.to_json()
with open('tokenizer.json', 'w') as f:
    f.write(tokenizer_json)
\`\`\`

## Technologies Used

- **Backend**: Flask, Python
- **Machine Learning**: Keras, TensorFlow
- **Text Preprocessing**: Tokenizer and text vectorization
- **Frontend**: HTML, CSS, JavaScript

## Future Enhancements

- Add more robust error handling in the Flask application.
- Improve model accuracy by experimenting with advanced NLP techniques (BERT, GPT, etc.).
- Add support for multilingual spam detection.
- Implement model optimization to reduce inference time.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
