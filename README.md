# AyeAyeCaption - A Video Caption Studio

![Sample](https://github.com/user-attachments/assets/dd131966-2297-4dc6-b8c5-432164eb3112) 

Video Caption Studio is a web application that allows users to add captions to videos. Users can load a video via a URL, add captions with precise timestamps, and export the captions as a `.vtt` file. The app supports both direct video files (e.g., `.mp4`, `.webm`) and embedded videos from platforms like YouTube and Vimeo.

---

## Features

- **Load Videos**: Enter a URL to load a video from YouTube, Vimeo, or a direct video file.
- **Add Captions**: Add captions with start and end timestamps.
- **Edit/Delete Captions**: Edit or delete existing captions.
- **Export Captions**: Export captions as a `.vtt` file for offline use.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

---

## Technical Decisions

### 1. **Tech Stack**
- **Frontend**: React (Next.js) with Material-UI for styling.
- **State Management**: Redux Toolkit for managing global state (video URL, captions, timestamps).
- **Video Player**: HTML5 `<video>` element for direct video files and `<iframe>` for embedded videos.
- **Captions**: WebVTT format for caption synchronization.

### 2. **User Experience (UX)**
- **Top-to-Bottom Flow**: Users must load a video before adding captions, ensuring a logical workflow.
- **Real-Time Feedback**: Error messages and success feedback are displayed using Material-UI `Snackbar` and `Alert` components.
- **Intuitive Inputs**: Timestamp inputs automatically format as `HH:MM:SS` and validate user input.
- **Responsive Design**: The app is optimized for both desktop and mobile devices.

### 3. **Trade-Offs**
- **Embedded Video Limitations**: For embedded videos (YouTube, Vimeo), captions cannot be overlaid directly due to platform restrictions. Instead, captions are displayed below the video.
- **Direct Video Files**: For direct video files, captions are overlaid using the `<track>` element and WebVTT format.
- **Performance**: Generating a `.vtt` file dynamically for direct video files adds a slight performance overhead but ensures accurate caption synchronization.

---

## Future Improvements

Given more time, here’s what I would build next to optimize for user experience:

1. **Auto-Sync Captions**:
   - Add a feature to auto-sync captions with the video by clicking a button at the desired timestamp.

2. **Speech-to-Text**:
   - Integrate a speech-to-text API (e.g., Google Speech-to-Text) to automatically generate captions from the video’s audio.

3. **User Authentication**:
   - Add user authentication to save and load projects.

4. **Multi-Language Support**:
   - Support multiple languages for captions.

---

## Project Tree

Here’s the complete project structure:

```
video-caption-app/
├── public/
│   └── assets/                # Static assets (images, icons, etc.)
├── src/
│   ├── components/            # Reusable components
│   │   ├── VideoPlayer.js     # Video player component
│   │   ├── CaptionForm.js     # Form for adding/editing captions
│   │   └── TimestampInput.js  # Input for timestamps
│   ├── pages/                 # Next.js pages
│   │   ├── index.js           # Main page
│   │   └── _app.js            # Custom App component (Redux provider, theme)
│   ├── redux/                 # Redux state management
│   │   ├── store.js           # Redux store
│   │   └── slices/            # Redux slices
│   │       └── captionsSlice.js # Slice for video URL, captions, and timestamps
│   ├── styles/                # Global styles
│   │   └── globals.css        # Global CSS file
│   └── utils/                 # Utility functions
│       └── validation.js      # Validation functions (e.g., timestamp validation)
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

---

## How to Run the Project

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/video-caption-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd video-caption-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

---

## Deployment

The app is deployed using [Vercel](https://vercel.com/). You can access the live version here: [Live Demo](#) <!-- Add your live demo link here -->

---

## Contributing

Contributions are welcome! If you’d like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Material-UI](https://mui.com/) for the UI components.
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management.
- [Next.js](https://nextjs.org/) for the React framework.
