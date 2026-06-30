# Custom URL Shortening Service

*High-Performance URL Abstraction via Base62 Encoding and Asynchronous Atomic Telemetry.*

An industrial-grade abstraction layer designed to condense long destination URLs into deterministic, shareable aliases. This service emphasizes a low-latency redirection flow for end-users while seamlessly handling real-time analytical click tracking in the background. It utilizes atomic database operations to ensure data integrity under concurrent traffic loads.

---

## Key Features & Technical Highlights

| Feature | Technical Implementation | Architectural Benefit |
| :--- | :--- | :--- |
| **URL Compression** | Custom Base62 encoding utility | Generates highly deterministic, short 6-character alphanumeric aliases independently of distributed ID generators. |
| **Input Validation** | Regex matching & protocol verification | Sanitizes payloads (requiring `http`/`https` and alphanumeric custom aliases) to mitigate injection vulnerabilities and routing failures. |
| **High-Throughput Redirection** | Optimized HTTP `302 Found` response routing | Ensures immediate client-side destination forwarding without blocking on database write operations. |
| **Analytics Telemetry** | Isolated atomic field updates (`$inc` operator) | Handles real-time click tracking under high concurrency without triggering read-write race conditions. |

---

## System Architecture & Directory Structure

```text
custom-url-shortener/
├── src/
│   ├── config/
│   │   └── db.js            # MongoDB connection configuration and initialization
│   ├── controllers/
│   │   └── urlController.js # API logic for URL validation, generation, and redirection
│   ├── models/
│   │   └── Url.js           # Mongoose schema enforcing unique indexed aliases and click tracking
│   ├── routes/
│   │   └── urlRoutes.js     # Express routing definitions mapping to controller logic
│   ├── utils/
│   │   └── base62.js        # Standalone Base62 alphanumeric 6-character string generator
│   └── app.js               # Express application entry point, mounting middleware and routes
├── .env.example             # Sanitized template for environment variables
├── .gitignore               # Configuration for untracked files (e.g., node_modules, .env)
├── package.json             # Dependency manifest and runtime npm scripts
└── README.md                # Primary project documentation
```

---

## API Specification & Endpoints

### 1. Create Short URL
- **Endpoint**: `POST /api/shorten`
- **Content-Type**: `application/json`
- **Action**: Validates the input URL, generates a Base62 alias (or accepts a valid custom alias), and persists the mapping to MongoDB.

**Request Payload Example:**
```json
{
  "originalUrl": "https://iitkgp.ac.in",
  "customAlias": "iitkgp" 
}
```
*(Note: `customAlias` is optional. If omitted, a random 6-character Base62 string is generated).*

**Response Payload Example (201 Created):**
```json
{
  "originalUrl": "https://iitkgp.ac.in",
  "alias": "iitkgp",
  "shortUrl": "http://localhost:3000/iitkgp"
}
```

**Error Responses:**
- `400 Bad Request`: Returned if the URL is missing/malformed, or if the custom alias contains non-alphanumeric characters.
- `409 Conflict`: Returned if the requested custom alias is already in use.

### 2. URL Redirection & Analytics Trigger
- **Endpoint**: `GET /:alias`
- **Action**: Resolves the custom alphanumeric alias, fires a fire-and-forget asynchronous database update to increment the analytical click counter, and immediately issues an HTTP `302 Found` header containing the original URL destination.

**Response Payload:**
- **Success**: HTTP `302 Found` redirect to the original URL.
- **Error (404 Not Found)**:
  ```json
  {
    "error": "URL not found"
  }
  ```

---

## Environment Configuration & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HimanshuGupta2512/custom-url-shortener.git
   cd custom-url-shortener
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the Environment Variables:**
   Create a `.env` file in the root directory and configure it based on the `.env.example` structure:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   ```
   *(Note: For production, replace the local MongoDB URI with your MongoDB Atlas connection string).*

4. **Initialize the Server:**
   ```bash
   # For production environments
   npm start
   
   # For local development with live-reloading
   npm run dev
   ```

---
*Developed by [Himanshu Gupta](https://github.com/HimanshuGupta2512) | Indian Institute of Technology (IIT) Kharagpur*
