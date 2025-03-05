# MemeVerse

🚀 **MemeVerse** is a highly interactive, multi-page meme exploration platform built with **Next.js** and **React**. Users can explore, upload, and engage with memes dynamically, featuring infinite scrolling, meme generation, AI-powered captions, and a leaderboard for the most popular memes.

🔗 **Live Demo:** [MemeVerse](https://meme-verse-olive.vercel.app/)

## 🌟 Features

### 🔥 **Homepage**

- Displays trending memes dynamically (fetched via API).
- Interactive animations with smooth transitions.
- Dark mode toggle for enhanced user experience.

### 🎭 **Meme Explorer Page**

- Infinite scrolling or pagination support.
- Filter memes by categories: Trending, New, Classic, Random.
- Search memes with debounced API calls for performance.
- Sort memes by likes, date, or comments.

### 🎨 **Meme Upload Page**

- Upload image/GIF-based memes.
- Add captions with a rich text editor (Jodit).
- AI-powered meme caption generation using **@google/generative-ai**.
- Meme preview before uploading.

### 🖼 **Meme Details Page**

- Dynamic routing (`/meme/:id`) for individual memes.
- View meme details, likes, comments, and sharing options.
- Like and comment system (stored in **local storage**).

### 👤 **User Profile Page**

- Displays user-uploaded memes.
- Edit profile details (Name, Bio, Profile Picture).
- View liked memes (saved in **local storage** ).

### 🏆 **Leaderboard Page**

- Displays **Top 10 most liked memes**.
- Ranks users based on engagement.

### 🎭 **Fun 404 Page**

- Custom **meme-based** 404 error page for invalid routes.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (React 19)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Context API
- **Storage**: Local Storage
- **Meme APIs**: Imgflip API
- **Hosting & Deployment**: Vercel
- **Authentication**: Firebase

---

## ⚙️ Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Sadia492/MemeVerse.git
   cd MemeVerse
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a **.env.local** file for API keys and configuration (example):
   ```
   NEXT_PUBLIC_MEME_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_CONFIG=your_firebase_config
   ```
4. Run the project:
   ```sh
   npm run dev
   ```
   The app will be live at **http://localhost:3000**

---

## 🚀 Usage

- Visit the **homepage** to explore trending memes.
- Navigate to **Meme Explorer** to filter, search, and sort memes.
- Upload your own memes and generate captions using AI.
- View details, like, comment, and share memes.
- Check out the **Leaderboard** for top memes and rankings.
- Edit your **profile** and view your uploaded/liked memes.

---

## 🌐 API Integration

- **Meme APIs:**
  - [Imgflip API](https://imgflip.com/api) – Fetch and generate memes.
  - [Meme Generator API](https://memegen.link/) – Create custom memes dynamically.
- **Image Upload & Storage:**
  - [Imgbb](https://api.imgbb.com/) – Stores uploaded images.

---

## ⚡️ Performance Optimization

- **Lazy Loading**: Images are lazy-loaded for better performance.
- **Code Splitting**: Next.js dynamically imports components where needed.
- **Optimized API Calls**: Axios with **debounced** search requests.
- **Animations**: **Framer Motion** for smooth UI transitions.
