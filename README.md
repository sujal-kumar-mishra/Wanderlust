# Wanderlust 🧳🏡

Wanderlust is a travel booking web application designed for travelers to browse, create, and book rental listings—similar to Airbnb. Users can register, log in, and manage their own listings, complete with photos and location maps.

## 🌐 Live Demo

👉 [View the Live Site](https://wanderlust-vvo1.onrender.com/listings)

---

## ✨ Features

- ✅ User registration and login (with session-based authentication)
- 🏠 Create, edit, and delete rental listings
- 🖼️ Image uploads with Cloudinary
- 🗺️ Map location integration using Mapbox
- 🔒 Authorization to allow only listing owners to modify content
- 💡 Flash messages for alerts and validations
- 🧭 Filtering and category-based browsing
- 📱 Fully responsive design with Bootstrap
- ⚠️ Global error handling

---

## 🛠️ Tech Stack

**Frontend:**
- HTML, CSS, JavaScript
- Bootstrap for UI components
- EJS templating engine

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose

**Other Tools:**
- Cloudinary for image hosting
- Mapbox for geolocation maps
- Passport.js for authentication
- dotenv for environment configuration
- Render for deployment

---

## 🧑‍💻 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- A Cloudinary account
- A Mapbox account

### Clone and Setup

```bash
git clone https://github.com/sujal-kumar-mishra/Wanderlust.git
cd Wanderlust
npm install
```


### 🚀 Usage

- 🔐 **Register/Login**: Users must sign up or log in to access full features.
- ➕ **Add a Listing**: Logged-in users can create new property listings.
- 🖼️ **Upload Images**: Users can upload one or more images using Cloudinary integration.
- ✏️ **Edit/Delete Listings**: Users can only edit or delete listings they created.
- 🌍 **View on Map**: Listings include an interactive location map.
- 🔍 **Browse Listings**: Use filters and categories to search and view all listings.


✏️ Edit/Delete Listings: Only the owner of a listing can modify or delete it.

🌍 View Map: Listings include an interactive map based on the location provided.
