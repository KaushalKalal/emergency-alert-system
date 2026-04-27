#  Emergency Alert System

A real-world backend system that allows users to send emergency alerts, classifies urgency using AI, stores alerts in a database, and provides a real-time dashboard with WebSocket support.

---



##  Tech Stack

### Backend
| Package   | Purpose 

| express   | Web framework for Node.js 
| mongoose  | MongoDB object modeling 
| groq-sdk  | AI urgency classification + Chatbot 
| socket.io | Real-time WebSocket updates 
| joi       | Request validation 
| cors      | Cross-origin resource sharing 
| dotenv    | Environment variable management
| nodemon   | Auto restart during development 


### Frontend
| Package           | Purpose 

| react             | UI library 
| react-router-dom  | Page navigation 
| axios             | HTTP API calls 
| socket.io-client  | Real-time socket connection 




# All Routes regarding to Emergency Alert System


GET http://localhost:5000/


// Send Alert [ HIGH, MEDIUM, LOW ]
POST http://localhost:5000/api/alerts/send
{
  "name": "Kaushal",
  "phone": "9876543210",
  "location": "Ahmedabad, Gujarat",
  "message": "Someone is attacking me with the knife please help me"
}


// Get All Alerts
GET http://localhost:5000/api/alerts



// Filter by [ HIGH, MEDIUM, LOW, active ]
GET http://localhost:5000/api/alerts?urgency=HIGH



// Filter by Both
GET http://localhost:5000/api/alerts?urgency=HIGH&status=active



// Get Single Alert
http://localhost:5000/api/alerts/SingleAlertID



// Resolve Alert
PATCH http://localhost:5000/api/alerts/PASTE_ALERT_ID_HERE/resolve


// Chatbot 
POST http://localhost:5000/api/chat
{
  "message": "Someone is following me on street what should I do?"
}