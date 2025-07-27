# TripSage: Your AI-Powered Trip Planning Assistant

## About TripSage

TripSage is a web-based application designed to streamline trip planning by leveraging advanced AI technologies. Users can input their travel preferences, including source, destination, dates, budget, number of travelers, and interests, to receive a personalized, day-wise itinerary. The application also integrates with SerpApi to fetch the best flight options when requested. Additionally, an AI-powered chat assistant, built with Google Generative AI and Socket.IO, provides real-time support for travel-related queries. With a responsive design using Tailwind CSS, TripSage ensures a seamless experience across mobile and desktop devices.

## Features

- **Personalized Itinerary Generation**: Creates detailed, day-wise travel plans using Google Generative AI, tailored to user preferences.
- **Flight Options**: Fetches the best flight deals via SerpApi, including details like price, duration, and booking links.
- **AI Chat Assistant**: Offers real-time assistance through a chat interface, maintaining context for relevant responses.
- **Responsive Design**: Optimized for both mobile and desktop, with a clean and modern interface using Tailwind CSS.
- **Error Handling**: Includes a professional error page with a black-and-white theme for clear error communication.

## Getting Started

### Prerequisites

To run TripSage locally, ensure you have the following installed:

- **Node.js**: Version 14 or higher ([Download Node.js](https://nodejs.org/))
- **npm or yarn**: For package management ([npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/))

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SHAIK-RAIYAN/TripSage.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd TripSage
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
4. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the following variables, replacing placeholders with your actual keys:
     ```
     SECRET_SESSION_KEY=your_secret_key
     GEMINI_API_KEY=your_gemini_api_key
     SERP_API_KEY=your_serp_api_key
     PORT=3000
     ```
   - Obtain API keys from [Google Cloud](https://cloud.google.com/) for Google Generative AI and [SerpApi](https://serpapi.com/) for flight data.
5. **Start the Server**:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

### Usage

1. Open your browser and navigate to `[invalid url, do not cite]`.
2. Fill out the trip planning form with details such as source, destination, travel dates, budget, number of travelers, and interests.
3. Submit the form to generate a personalized itinerary. If you selected the "Include transportation" option, flight options will also be displayed.
4. Use the chat feature on the itinerary page to ask questions about your trip, such as recommendations for activities or local tips.

## Technologies Used

TripSage is built with a modern technology stack to ensure functionality and scalability. The key technologies include:

| **Category**                | **Technologies**                            |
| --------------------------- | ------------------------------------------- |
| **Backend**                 | Node.js, Express.js                         |
| **Frontend**                | EJS (Embedded JavaScript), Tailwind CSS v4  |
| **Real-time Communication** | Socket.IO                                   |
| **AI Services**             | Google Generative AI (Gemini)               |
| **Flight Data**             | SerpApi                                     |
| **Utilities**               | fast-fuzzy, aircodes, marked, sanitize-html |

## Project Structure

The project is organized for modularity and maintainability, as shown below:

```
TRIP-SAGE/
├── node_modules/                # Dependencies installed via npm/yarn
├── public/                      # Static assets
│   ├── css/                     # CSS styles
│   │   ├── output.css           # Tailwind-generated CSS
│   │   └── styles.css           # Custom CSS
│   ├── images/                  # Image assets
│   └── js/                      # Client-side JavaScript
│       ├── chat.js              # Chat functionality
│       ├── main.js              # Form interactions
│       └── validation.js        # Form validation
├── services/                    # Backend services
│   ├── chatService.js           # Chat session management
│   ├── flightService.js         # Flight data fetching
│   └── geminiAgent.js           # Itinerary generation
├── utils/                       # Utility functions
│   ├── ExpressError.js          # Custom error handling
│   ├── getAirportData.js        # Airport code resolution
│   └── wrapAsync.js             # Async middleware wrapper
├── views/                       # EJS templates
│   ├── error.ejs                # Error page
│   ├── index.ejs                # Trip planning form
│   └── itinerary.ejs            # Itinerary and flight display
├── .env                         # Environment variables
├── .gitignore                   # Git ignore file
├── index.js                     # Main server file
├── package-lock.json            # Dependency lock file
├── package.json                 # Project metadata and dependencies
└── README.md                    # Project documentation
```

## Contributing

Contributions to TripSage are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes, ensuring code follows best practices and includes tests where applicable.
4. Submit a pull request with a clear description of your changes.

Please ensure your contributions align with the project's coding standards and include appropriate documentation.

## Contact

For questions, feedback, or issues, please contact the developer:

- **GitHub**: [SHAIK-RAIYAN](https://github.com/SHAIK-RAIYAN)
- **Email**: [shaikraiyan2005@gmail.com](mailto:shaikraiyan2005@gmail.com)

## Acknowledgments

- [Google Generative AI](https://cloud.google.com/) for powering itinerary generation and chat functionality.
- [SerpApi](https://serpapi.com/) for providing flight data.
- Open-source libraries like `fast-fuzzy`, `aircodes`, `marked`, and `sanitize-html` for enhancing functionality.

⭐ **Show Some Love**  
If you enjoy this project, drop a star ⭐ on the repo and share your thoughts! 🚀

💡 Made with ❤️ by [SHAIK-RAIYAN](https://github.com/SHAIK-RAIYAN).
