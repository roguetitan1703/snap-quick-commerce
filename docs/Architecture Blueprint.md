## 1. Overall System Architecture

### 1.1. Project Division

- **Frontend**

  - **Customer Mobile WebApp (“Snap the Quick Commerce Store”):**  
    A mobile-first, Progressive Web App (PWA) that enables users to log in, browse products, manage their cart, place orders, and receive real-time product recommendations. The UI is designed for touch interactions and optimized for mobile screen sizes.  
    **Key Mobile Features:**
    - **Bottom Navigation Bar:** A fixed bar with key sections—Home, Categories, Cart, Orders, and Profile—for easy access.
    - **Responsive Layout:** Utilizes mobile-first CSS (e.g., Tailwind CSS) for responsive design.
    - **Touch-Friendly UI:** Large tap targets, swipe gestures (e.g., swipe-to-delete in the cart), and simplified forms.
  - **Admin Dashboard:**  
    A responsive web interface (optimized for tablet/desktop) that provides inventory management, demand prediction visualization, order tracking, and reporting tools.

- **Backend (API Server)**

  - A central service (Java Spring Boot) that:
    - Serves REST endpoints for authentication, product/inventory management, order processing, and model interactions.
    - Interfaces with PostgreSQL for transactional data.
    - Communicates with model servers for demand predictions and recommendations.

- **Models**
  - **Demand Prediction Model Server:**  
    A containerized microservice running an LSTM-based neural network for forecasting product demand.
  - **Recommendation Model Server:**  
    A containerized microservice running the Apriori algorithm, using HBase for data ingestion and Redis for caching recommendations.

---

## 2. Detailed Data Structure Schemas

### 2.1. PostgreSQL (Core Transactional Data)

#### **Users Table**

| Column Name   | Type        | Description                    |
| ------------- | ----------- | ------------------------------ |
| user_id       | UUID/Serial | Primary key, unique identifier |
| username      | VARCHAR     | Username for login             |
| email         | VARCHAR     | User email address             |
| password_hash | VARCHAR     | Encrypted password             |
| created_at    | TIMESTAMP   | Registration timestamp         |
| updated_at    | TIMESTAMP   | Last update timestamp          |

#### **Products Table**

| Column Name   | Type        | Description                            |
| ------------- | ----------- | -------------------------------------- |
| product_id    | UUID/Serial | Primary key, unique product identifier |
| name          | VARCHAR     | Name of the product                    |
| category      | VARCHAR     | Product category                       |
| description   | TEXT        | Detailed description of the product    |
| price         | DECIMAL     | Price per unit                         |
| current_stock | INT         | Current available stock                |
| image_url     | VARCHAR     | URL of the product image               |
| created_at    | TIMESTAMP   | Timestamp when the product was added   |
| updated_at    | TIMESTAMP   | Last update timestamp                  |

#### **Orders Table**

| Column Name | Type        | Description                                 |
| ----------- | ----------- | ------------------------------------------- |
| order_id    | UUID/Serial | Primary key, unique order identifier        |
| user_id     | UUID        | Foreign key, references Users               |
| order_date  | TIMESTAMP   | Timestamp of order placement                |
| status      | VARCHAR     | Order status (e.g., “placed”, “processing”) |

#### **Order_Items Table**

| Column Name    | Type        | Description                                  |
| -------------- | ----------- | -------------------------------------------- |
| order_item_id  | UUID/Serial | Primary key, unique identifier for each item |
| order_id       | UUID        | Foreign key, references Orders               |
| product_id     | UUID        | Foreign key, references Products             |
| quantity       | INT         | Quantity ordered                             |
| price_at_order | DECIMAL     | Price at the time of the order               |

#### **Sales Table** (For historical data to train the LSTM model)

| Column Name   | Type      | Description                      |
| ------------- | --------- | -------------------------------- |
| sale_id       | Serial    | Primary key                      |
| product_id    | UUID      | Foreign key, references Products |
| sale_date     | TIMESTAMP | Date and time of the sale        |
| quantity_sold | INT       | Number of units sold             |

---

### 2.2. HBase (For Recommendation Transactional Data)

#### **Transactions Table**

- **Row Key:**  
  Combination of `user_id` and `timestamp` or a unique `order_id`.

- **Column Family: orders**

  | Column Qualifier | Data Stored                                                                                 |
  | ---------------- | ------------------------------------------------------------------------------------------- |
  | user_id          | Unique ID of the user                                                                       |
  | order_id         | Unique transaction ID                                                                       |
  | products         | List of product IDs (comma-separated or as multiple columns, e.g., product_1, product_2, …) |
  | timestamp        | Time of order placement                                                                     |

---

### 2.3. Redis (For Real-Time Recommendation Cache)

- **Key-Value Format:**
  - **Key:** `product_id`
  - **Value:** Serialized JSON (or similar format) representing an array of recommended product IDs  
    _Example:_
    ```json
    { "recommended": ["prod123", "prod456", "prod789"] }
    ```

---

## 3. API Endpoints & Server Structure

### 3.1. Backend API Endpoints (Java Spring Boot)

#### **Authentication & User Management**

- **POST /api/auth/login**  
  _Input:_ `{ username, password }`  
  _Output:_ JWT token and user details.

- **POST /api/auth/register**  
  _Input:_ `{ username, email, password, ... }`  
  _Output:_ Confirmation and user details.

#### **Product & Inventory Management**

- **GET /api/products**  
  Retrieves product list; accepts optional query params (category, search).

- **GET /api/products/{productId}**  
  Retrieves detailed product information.

- **POST /api/products** (Admin only)  
  _Input:_ `{ name, category, price, initialStock, description, imageUrl, ... }`

- **PUT /api/products/{productId}** (Admin only)  
  Updates product details.

- **DELETE /api/products/{productId}** (Admin only)  
  Deletes a product.

- **GET /api/inventory** (Admin only)  
  Retrieves current inventory levels.

- **PUT /api/inventory/{productId}** (Admin only)  
  Manually updates inventory levels.

#### **Cart & Order Management**

- **GET /api/cart**  
  Retrieves the current user’s cart items.

- **POST /api/cart**  
  _Input:_ `{ productId, quantity }`  
  Adds an item to the cart.

- **PUT /api/cart/{itemId}**  
  Updates quantity of a cart item.

- **DELETE /api/cart/{itemId}**  
  Removes an item from the cart.

- **POST /api/orders**  
  _Input:_ `{ userId, cartItems, timestamp }`  
  Places an order and returns order confirmation.

- **GET /api/orders**  
  Retrieves order history for the user (or admin view).

#### **Demand Prediction & Recommendations**

- **GET /api/predictions**  
  _Query Params:_ `{ productId?, category?, dateRange? }`  
  Retrieves forecasted demand by internally querying the Demand Prediction Model Server.

- **GET /api/recommendations**  
  _Query Params:_ `{ productId }`  
  Retrieves recommendations by querying the Recommendation Model Server.

---

### 3.2. Model Server Endpoints

#### **Demand Prediction Model Server (LSTM)**

- **Endpoint:** `POST /api/v1/predict`  
  _Input:_
  ```json
  {
    "productId": "prod123",
    "historicalData": [...],
    "features": {
      "seasonality": "...",
      "promotions": "..."
    }
  }
  ```
  _Output:_
  ```json
  {
    "predicted_quantity": 50,
    "confidence": 0.87,
    "forecast_range": ["2025-04-03", "2025-04-10"]
  }
  ```
- **Training Pipeline:**  
  Uses Apache Spark for data ingestion and periodic retraining (triggered via Airflow/Cron).

#### **Recommendation Model Server (Apriori)**

- **Endpoint:** `POST /api/v1/recommend`  
  _Input:_
  ```json
  { "productId": "prod123" }
  ```
  _Output:_
  ```json
  { "recommended_products": ["prod456", "prod789"] }
  ```
- **Batch Processing:**  
  Runs the Apriori algorithm every 20 minutes on transactional data stored in HBase.
- **Real-Time Caching:**  
  Recommendations are stored/updated in Redis for fast retrieval.

---

## 4. Frontend: “Snap the Quick Commerce Store” – Screens & Features (Mobile-First)

### 4.1. Customer Mobile WebApp Screens

1. **Login / Registration Screen**

   - **Design:**
     - Full-screen, vertically stacked input fields optimized for mobile.
     - Large tap targets and inline error messaging.
   - **Features:**
     - Email/username and password fields.
     - Social login options and “Forgot Password” link.

2. **Home / Product Listing Screen**

   - **Design:**
     - Vertical scroll with card-based layout.
     - Prominent search bar and filter options accessible via a slide-in drawer or modal.
   - **Features:**
     - Displays product thumbnails, prices, and brief descriptions.
     - Infinite scrolling or paginated lists.
     - **Bottom Navigation:**  
       A fixed bottom navigation bar allows access to Home, Categories, Cart, Orders, and Profile.

3. **Product Detail Screen**

   - **Design:**
     - Single-column layout with large, high-resolution product images.
     - Fixed “Add to Cart” button at the bottom.
   - **Features:**
     - Full product description, stock information, and pricing.
     - On tapping “Add to Cart,” triggers an API call that also fetches real-time recommendations (displayed via a temporary toast or modal).

4. **Cart Screen**

   - **Design:**
     - List view with swipe-to-delete functionality for cart items.
     - Fixed checkout button.
   - **Features:**
     - Update quantities via plus/minus controls.
     - Display real-time recommendations in a carousel beneath the cart items.

5. **Order Confirmation Screen**

   - **Design:**
     - Clean, summary view with large typography for order ID and status.
   - **Features:**
     - Displays order details and status (e.g., “Order Placed”).
     - Call-to-action button for “Back to Home.”

6. **User Account Screen**
   - **Design:**
     - Mobile-friendly list or tab view with accordion sections.
   - **Features:**
     - Displays order history, profile details, and settings.
     - Inline editing for personal details and shipping address.

### 4.2. Admin Dashboard Screens (Responsive Web Interface)

1. **Dashboard Overview**

   - **Features:**
     - Real-time metrics: total sales, pending orders, low-stock alerts.
     - Interactive charts/graphs for inventory and key performance indicators.

2. **Inventory Management Screen**

   - **Features:**
     - List view with current stock levels and product details.
     - CRUD operations and manual stock adjustments.

3. **Demand Prediction Screen**

   - **Features:**
     - Interactive charts comparing historical sales with forecasted demand.
     - Filters by date range and product category.
     - Detailed view for individual product predictions.

4. **Order Management Screen**

   - **Features:**
     - Comprehensive order list with filtering (by status, date, etc.).
     - Detailed order view with customer and product details.

5. **Reports & Analytics Screen**
   - **Features:**
     - Downloadable reports (CSV/PDF).
     - Interactive dashboard with trends, performance metrics, and analytics.

---

## 5. Additional Infrastructure & Integration

### 5.1. Containerization & Deployment

- **Docker:**  
  Containerize each service (Frontend, Backend, Demand Prediction, Recommendation) for consistent deployment.
- **Orchestration:**  
  Use Kubernetes or Docker Compose for local development and production scalability.

### 5.2. Data Processing & Scheduling

- **Apache Spark:**  
  Handles data transformation for historical sales data and runs batch processes for:
  - Model training (demand prediction).
  - The Apriori algorithm (recommendation).
- **Scheduler:**  
  Use Airflow or Cron Jobs to trigger recommendation batch jobs every 20 minutes.

### 5.3. Monitoring & Logging

- **Prometheus/Grafana:**  
  Monitor service health and performance.
- **Centralized Logging:**  
  Use ELK (Elasticsearch, Logstash, Kibana) for log aggregation across services.

---

## Summary

This comprehensive blueprint now reflects a mobile-first approach for “Snap the Quick Commerce Store,” including:

- **Project Division:**  
  Frontend (mobile webapp with bottom navigation and responsive design), Backend, and Model Services.
- **Detailed Data Schemas:**  
  PostgreSQL, HBase, and Redis configurations to support the system.
- **API Endpoints & Server Architecture:**  
  Clear endpoints for authentication, product/inventory management, cart/order handling, and model interactions.
- **Frontend Screen Flows:**  
  Optimized for mobile devices with touch-friendly UI, a bottom navigation bar, and progressive enhancements.
- **Infrastructure Considerations:**  
  Containerization, orchestration, data processing, scheduling, and monitoring for a robust MVP.
