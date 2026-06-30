# Custom URL Shortening Service

*Base62 custom encoding utility and asynchronous atomic telemetry.*

An abstraction layer over long, complex destination URLs is critical for improving user experience, simplifying sharing, and tracking engagement. This service provides a robust, performance-optimized redirection flow that minimizes latency while asynchronously capturing granular analytical data without introducing read-write blocks.

---

## Key Features & Technical Highlights

| Feature | Technical Implementation | Architectural Benefit |
| :--- | :--- | :--- |
| **URL Compression** | Custom Base62 encoding algorithm | Generates highly deterministic, short 6-character alphanumeric aliases |
| **Input Validation** | Regular Expression (Regex) matching tier | Sanitizes incoming payloads to mitigate routing and injection vulnerabilities |
| **High-Throughput Redirection** | Optimized HTTP `302 Found` response routing | Ensures immediate, low-latency client-side destination forwarding |
| **Analytics Telemetry** | Isolated atomic field updates (`$inc` operator) | Handles real-time click tracking under concurrency without read-write blocks |

---

## System Architecture & Directory Structure

```text
custom-url-shortener/
├── src/
│   ├── config/
│   │   └── db.js          # MongoDB Atlas cluster connection management
│   ├── controllers/
│   │   └── urlController.js # REST API handlers for shortening & redirection
│   ├── models/
│   │   └── Url.js         # Mongoose data schema with indexed field rules
│   ├── utils/
│   │   └── base62.js      # Core mathematical key generation logic
│   └── app.js             # Express application initialization & middleware config
├── .env.example           # Sanitized layout for environmental keys
├── package.json           # Dependency manifest and runtime scripts
└── README.md              # Project documentation
```

---

## API Specification & Endpoints

### A. Create Short URL
- **Endpoint**: `POST /api/shorten`
- **Content-Type**: `application/json`

**Request Payload Example:**
```json
{
  "originalUrl": "https://iitkgp.ac.in"
}
```

**Response Payload Example (201 Created):**
```json
{
  "originalUrl": "https://iitkgp.ac.in",
  "alias": "FFmk3u",
  "shortUrl": "http://localhost:3000/FFmk3u",
  "clicks": 0
}
```

### B. URL Redirection & Analytics Trigger
- **Endpoint**: `GET /:alias`
- **Action**: Resolves the custom 6-character token, fires an asynchronous update to increment the analytical click counter inside the document layer, and issues an HTTP `302 Found` header containing the original address destination.

---

## Environment Configuration & Setup

1. **Clone the repository structure:**
   ```bash
   git clone https://github.com/HimanshuGupta2512/custom-url-shortener.git
   cd custom-url-shortener
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory following this layout:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.le9dtjd.mongodb.net/url-shortener?appName=Cluster0
   ```

4. **Initialize the environment:**
   ```bash
   npm start
   ```

---
*Developed by [Himanshu Gupta](https://github.com/HimanshuGupta2512) | Indian Institute of Technology (IIT) Kharagpur*
