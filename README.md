
# FAQ Management System

This project enables efficient creation, retrieval, and management of FAQs with support for caching using Redis for improved performance

## Table of Contents
  1. [Installation](#installation)
  2. [Environment Variables](#environment-variables)
  3. [API Endpoints](#api-endpoints)
  4. [Usage Examples](#usage-examples)
  5. [Contribution Guidelines](#contribution-guidelines)
  6. [License](#license)
## Features

- Add FAQs with multilingual translations.
- Fetch FAQs in a specific language.
- Redis caching for optimized performance.
- MongoDB for data persistence.




## Installation

1. Install my-project with npm

```bash
Clone The Repository
git clone https://github.com/yourusername/faq-management.git
cd faq-management
```

2. Install Dependencies:

```bash
npm install
```
3. Set up Redis:

- install Redis(if not already installed)
```bash
sudo apt update
sudo apt-get install redis
```

- start the Redis Server
```bash
redis-server
```

4. Set up MongoDB:

 Install and start MongoDB.
 Create a new database for the project.
5. Create a .env file in the root directory and configure the [environment variables](#environment-variables). (See Environment Variables section.)

6. Start the development server:
```bash
npm start
```
## Environment Variables

```bash
DATABASE=mongodb://localhost:27017/faq-management
PORT=8000
```
## API Endpoints

1. **Add FAQ with Translation**

- **Endpoint**: POST /api/faqs
- **Description**: Adds a new FAQ with a specific translation. If the question already exists, it adds the requested translation to the existing FAQ.

- Request Parameters:
  1. lang (query parameter): Target language code (e.g., en, fr, es). Default: en.

**Request Body**
```bash
{
  "question": "What is your refund policy?",
  "answer": "We offer a 30-day money-back guarantee."
}
```
**Response**:
- **201 Created**: New FAQ created with the requested translation.
- **200 OK**: Translation added to an existing FAQ or translation already exists.

2. **Get FAQs with Translations**

- **Endpoint**: GET /api/faqs
- **Description**: Fetches FAQs in the requested language, including the original question and answer.

- Request Parameters:
  1. lang (query parameter): Target language code (e.g., en, fr, es). Default: en.

**Response Body**
```bash
[
  {
    "question": "What is your refund policy?",
    "answer": "We offer a 30-day money-back guarantee.",
    "translation": {
      "question": "Quelle est votre politique de remboursement?",
      "answer": "Nous offrons une garantie de remboursement de 30 jours."
    }
  }
]
```
## Usage Examples

#### Add FAQ with Translation

- Request
```bash
curl -X POST http://localhost:8000/api/faqs?lang=fr \
-H "Content-Type: application/json" \
-d '{
  "question": "What is your refund policy?",
  "answer": "We offer a 30-day money-back guarantee."
}'
```

- Response
```bash
{
  "message": "FAQ created successfully with translation",
  "faq": {
    "_id": "64ecb9e4f3dc4b8f6a7cce76",
    "question": "What is your refund policy?",
    "answer": "We offer a 30-day money-back guarantee.",
    "translations": ["64ecb9e4f3dc4b8f6a7cce77"]
  }
}
```

#### Fetch FAQs in a Specific Language

- Request
```bash
curl -X GET http://localhost:8000/api/faqs?lang=fr'
```

- Response
```bash
[
  {
    "question": "What is your refund policy?",
    "answer": "We offer a 30-day money-back guarantee.",
    "translation": {
      "question": "Quelle est votre politique de remboursement?",
      "answer": "Nous offrons une garantie de remboursement de 30 jours."
    }
  }
]
```
## Contribution Guidelines

We welcome contributions to improve this project! Here's how you can help:

1. Fork the Repository
2. Create a new branch for your feature or bugfix:

```bash
git checkout -b feature-name
```
3. Make your changes and commit them:
```bash
git commit -m "Add your commit message here"
```

4. Push to your branches:
```bash
git push origin feature-name
```

5. Open a pull request with a detailed description of your changes.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/)

