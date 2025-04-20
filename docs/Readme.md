## 1. Overall Project Structure

The project is divided into three main parts:

- **Frontend**

  - **Customer Mobile WebApp (Snap the Quick Commerce Store):**  
    A mobile-first, Progressive Web App (PWA) optimized for touch interactions and small screens. This app allows users to log in, browse products, manage their cart, and place orders while receiving real-time product recommendations.  
    **Key Mobile Enhancements:**
    - **Bottom Navigation:** A fixed bar with primary sections (Home, Categories, Cart, Orders, and Profile) for easy access.
    - **Responsive & Touch-Friendly UI:** Designed with large tap targets, swipe gestures (e.g., for removing cart items), and optimized forms.
  - **Admin Dashboard:**  
    A responsive web interface (optimized for tablet/desktop) that provides management tools for inventory tracking, demand prediction visualization, order management, and analytics.

- **Backend**

  - A central API server (Java Spring Boot) that handles business logic, data persistence, and orchestration between the frontend and the model servers.
    - Exposes REST endpoints for authentication, product/inventory management, order processing, and model interactions.
    - Interacts with PostgreSQL for transactional data.
    - Communicates with model servers for demand predictions and recommendations.

- **Models**
  - **Demand Prediction Model Server:**  
    A containerized microservice running an LSTM-based neural network for forecasting product demand.
  - **Recommendation Model Server:**  
    A containerized microservice running the Apriori algorithm to generate product recommendations based on transactional data.  
    Uses HBase for data ingestion and Redis for caching recommendations.

---

## 2. Detailed API Endpoints

### 2.1. Authentication & User Management

- **POST /api/auth/login**  
  _Request:_ `{ username, password }`  
  _Response:_ JWT token and user details.

- **POST /api/auth/register**  
  _Request:_ `{ username, email, password, ... }`  
  _Response:_ Confirmation of registration and user details.

### 2.2. Product & Inventory Management

- **GET /api/products**  
  _Purpose:_ Fetch the list of available products (for both webapp and admin view).  
  _Optional Query Params:_ category, search term.

- **GET /api/products/{productId}**  
  _Purpose:_ Retrieve detailed information for a single product.

- **POST /api/products** (Admin only)  
  _Purpose:_ Create a new product.  
  _Request:_ `{ name, category, price, initialStock, description, imageUrl, ... }`

- **PUT /api/products/{productId}** (Admin only)  
  _Purpose:_ Update product details.

- **DELETE /api/products/{productId}** (Admin only)  
  _Purpose:_ Remove a product.

- **GET /api/inventory** (Admin only)  
  _Purpose:_ Retrieve current inventory status.

- **PUT /api/inventory/{productId}** (Admin only)  
  _Purpose:_ Update inventory levels manually (if needed).

### 2.3. Cart & Order Management

- **GET /api/cart**  
  _Purpose:_ Fetch current user cart.

- **POST /api/cart**  
  _Purpose:_ Add an item to the cart.  
  _Request:_ `{ productId, quantity }`

- **PUT /api/cart/{itemId}**  
  _Purpose:_ Update cart item quantity.

- **DELETE /api/cart/{itemId}**  
  _Purpose:_ Remove an item from the cart.

- **POST /api/orders**  
  _Purpose:_ Place an order.  
  _Request:_ `{ userId, cartItems, timestamp }`  
  _Response:_ Order confirmation and order ID.

- **GET /api/orders**  
  _Purpose:_ Retrieve order history (for user or admin view).

### 2.4. Demand Prediction & Recommendations

- **GET /api/predictions**  
  _Purpose:_ Retrieve demand forecast data.  
  _Query Params:_ `{ productId?, category?, dateRange? }`  
  _Internally:_ The backend forwards the request to the Demand Prediction Model Server.

- **GET /api/recommendations**  
  _Purpose:_ Fetch product recommendations for a given product in the cart.  
  _Query Params:_ `{ productId }`  
  _Internally:_ The backend calls the Recommendation Model Server to retrieve relevant product associations.

---

## 3. Server Architecture for Models

### 3.1. Demand Prediction Model Server (LSTM)

- **Deployment:**  
  Containerized microservice (e.g., using Docker) running the LSTM model.
- **Key Components:**
  - **Model Endpoint:**  
    **POST /api/v1/predict**  
    _Request:_ `{ productId, historicalSalesData, additionalFeatures (seasonality, promotions) }`  
    _Response:_ Forecasted demand data (e.g., predicted sales quantity for the upcoming period).
  - **Training Pipeline:**  
    Uses Apache Spark for data ingestion and periodic retraining (triggered via Airflow or Cron jobs).
  - **Data Storage:**  
    Stores trained models and logs in persistent storage for versioning.

### 3.2. Recommendation Model Server (Apriori)

- **Deployment:**  
  Containerized microservice built with a lightweight framework (Flask or FastAPI).
- **Key Components:**
  - **Batch Processing:**  
    A process (using Apache Spark/PySpark) that periodically runs the Apriori algorithm on transactional data stored in HBase.
  - **Model Endpoint:**  
    **POST /api/v1/recommend**  
    _Request:_ `{ productId, userId (optional) }`  
    _Response:_ List of recommended product IDs based on association rules.
  - **Real-Time Caching:**  
    Recommendations are stored and updated in Redis every 20 minutes for fast, low-latency retrieval.
  - **Scheduler:**  
    Cron jobs or Airflow to trigger batch jobs at defined intervals.

---

## 4. WebApp: “Snap the Quick Commerce Store” – Screens & Features

### 4.1. Customer Mobile WebApp Screens

1. **Login / Registration Screen**

   - **Features:**
     - Full-screen, vertically stacked input fields optimized for mobile.
     - Client-side validation and large tap targets.
     - Social login options (if applicable) and “Forgot Password” link.

2. **Home / Product Listing Screen**

   - **Features:**
     - Mobile-optimized, vertical scroll with card-based layout for products.
     - Prominent search bar and filter options (accessible via a slide-in drawer or modal).
     - Infinite scrolling or paginated lists.
     - **Bottom Navigation Bar:**  
       Provides quick access to Home, Categories, Cart, Orders, and Profile.

3. **Product Detail Screen**

   - **Features:**
     - Single-column layout with large, high-resolution product images.
     - Detailed view including full description, available stock, and pricing.
     - Fixed “Add to Cart” button at the bottom.
     - On adding a product, the app triggers an API call that also fetches real-time recommendations (displayed via a toast or modal).

4. **Cart Screen**

   - **Features:**
     - List view with swipe-to-delete functionality for cart items.
     - Plus/minus controls to update item quantities.
     - A fixed checkout button.
     - Display of real-time recommendations in a carousel below the cart items.

5. **Order Confirmation Screen**

   - **Features:**
     - Clean summary view with prominent order ID and status (e.g., “Order Placed”).
     - Option to view detailed order information and track order status.
     - Call-to-action button for “Back to Home.”

6. **User Account Screen**
   - **Features:**
     - Mobile-friendly list or tab view with sections for Order History, Profile, and Settings.
     - Inline editing options for personal details and shipping address.

### 4.2. Admin Dashboard Screens (Responsive Web Interface)

1. **Dashboard Overview**

   - **Features:**
     - Real-time metrics: total sales, pending orders, low-stock alerts.
     - Interactive charts and graphs for key performance indicators.
     - Quick stats summary.

2. **Inventory Management Screen**

   - **Features:**
     - List view with current stock levels and product details.
     - CRUD operations for adding, editing, or deleting products.
     - Manual stock adjustment interface.

3. **Demand Prediction Screen**

   - **Features:**
     - Interactive charts comparing historical sales with forecasted demand.
     - Filters for date range and product category.
     - Detailed view for individual product predictions.

4. **Order Management Screen**

   - **Features:**
     - Comprehensive order list with filtering options (by status, date, etc.).
     - Detailed view of individual orders including customer and product details.

5. **Reports & Analytics Screen**
   - **Features:**
     - Downloadable reports (CSV/PDF) on sales, inventory turnover, and forecast accuracy.
     - Interactive analytics dashboard with trend analysis and performance metrics.

---

## 5. MVP Development Considerations

- **Incremental Approach:**  
  Start with core functionalities (authentication, product listing, cart/order processing) before integrating model servers for demand prediction and recommendations.

- **Testing & Integration:**

  - Unit and integration tests for API endpoints.
  - End-to-end tests for user flows on the mobile webapp and admin dashboard.
  - Simulated model responses to decouple frontend development from model server readiness.

- **Deployment & Monitoring:**

  - Containerize services using Docker.
  - Use orchestration tools (Kubernetes or Docker Compose) for development and production scaling.
  - Implement logging and monitoring (using Prometheus/Grafana and ELK stack) for backend and model services.

- **Performance & Scalability:**
  - Use Redis caching for real-time recommendation retrieval.
  - Optimize Spark jobs for large data volumes in model training and batch processing.
  - Prepare the backend and model microservices for horizontal scaling.

---

## Summary

This updated blueprint provides a full roadmap for building the MVP of “Snap the Quick Commerce Store” as a mobile-first webapp. It includes:

- A clear **project division** into Frontend (with mobile-optimized customer webapp and admin dashboard), Backend, and Model services.
- **Detailed API endpoints** covering authentication, product/inventory management, cart/order handling, and model interactions.
- Comprehensive **server architecture** for both demand prediction (LSTM) and recommendation (Apriori) model servers.
- **Data schemas** for PostgreSQL, HBase, and Redis to support robust transactional and model-driven data handling.
- **Mobile-first screen flows** that feature a bottom navigation bar, touch-friendly interfaces, and progressive enhancements to ensure a smooth user experience on mobile devices.
- **Infrastructure considerations** for deployment, scheduling, monitoring, and scalability.
