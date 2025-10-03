# Move Out Marketplace - Setup Instructions

## 📁 File Structure

Place these files in your `moveout-marketplace` folder as follows:

```
moveout-marketplace/
├── index.html          (Homepage)
├── login.html          (Login page)  
├── register.html       (Registration page)
├── css/
│   └── style.css       (Main stylesheet)
├── js/
│   ├── homepage.js     (Homepage functionality)
│   └── auth.js         (Authentication logic)
├── data/
│   └── sample-items.json (Sample data - already created)
├── assets/
│   ├── images/
│   ├── icons/
│   └── logos/
├── requirements.txt
└── package.json
```

## 🚀 Setup Steps

1. **Download Files**: Save each file from the provided list into the correct folder location

2. **File Placement**:
   - Place `index.html`, `login.html`, `register.html` in the root `moveout-marketplace/` folder
   - Place `style.css` in the `moveout-marketplace/css/` folder
   - Place `homepage.js` and `auth.js` in the `moveout-marketplace/js/` folder

3. **Run the Application**:
   
   **Option A - Simple (No Installation)**
   ```bash
   # Just open index.html in your browser
   cd moveout-marketplace
   # Double-click index.html or drag it to your browser
   ```

   **Option B - Live Server (Recommended for Development)**
   ```bash
   # Install live-server globally
   npm install -g live-server
   
   # Navigate to project folder
   cd moveout-marketplace
   
   # Start live server
   live-server
   ```

   **Option C - Python Server**
   ```bash
   cd moveout-marketplace
   python -m http.server 8000
   # Visit: http://localhost:8000
   ```

## ✨ Features

- **Homepage**: Browse items, search, filter by category/location/condition
- **Authentication**: User registration and login with form validation
- **Item Listings**: View item details in modal popups
- **Contact Sellers**: WhatsApp integration for direct communication
- **Responsive Design**: Works perfectly on mobile and desktop
- **Local Storage**: User data and session management

## 🎯 How to Use

1. **Browse Items**: Visit the homepage to see featured listings
2. **Search & Filter**: Use the search bar and dropdown filters
3. **Create Account**: Click "Sign Up" to register a new account
4. **Login**: Use the "Login" button to sign into your account
5. **View Details**: Click "View Details" on any item card
6. **Contact Sellers**: Use "Contact" button to message via WhatsApp
7. **Post Items**: Login required to post new items (feature ready)

## 🎨 Customization

The project uses CSS custom properties (variables) for easy theming:

```css
:root {
  --primary-color: #2d7dd2;    /* Main brand color */
  --secondary-color: #34d399;  /* Success/accent color */
  --text-dark: #1f2937;        /* Main text color */
  /* ... more variables in style.css */
}
```

Change these values to customize colors throughout the entire application.

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- No external dependencies required

## 🔧 Technical Details

- **Frontend Only**: Pure HTML, CSS, JavaScript
- **Data Storage**: localStorage for user accounts and session
- **No Backend Required**: Everything runs client-side
- **Sample Data**: 10 pre-loaded items for demonstration
- **Form Validation**: Real-time validation with error messages
- **Password Strength**: Visual password strength indicator

## 🚀 Next Steps (Optional Enhancements)

1. **Add Backend**: Use Flask/Node.js for real user accounts
2. **Image Upload**: Allow users to upload actual item photos  
3. **Payment Integration**: Add payment gateway for transactions
4. **Maps Integration**: Show item locations on maps
5. **Push Notifications**: Notify users of new items/messages

## 🐛 Troubleshooting

**Items not showing?**
- Check browser console for JavaScript errors
- Ensure all file paths are correct (case-sensitive)

**Styling issues?**
- Verify `css/style.css` file path in HTML files
- Clear browser cache

**Forms not working?**
- Check that `js/auth.js` and `js/homepage.js` files are loaded
- Ensure JavaScript is enabled in browser

## 📞 Support

If you encounter any issues:
1. Check browser developer console for errors
2. Verify all files are in correct folders
3. Ensure file names match exactly (case-sensitive)

---

**Your Move Out Marketplace is ready! 🎉**

Open `index.html` in your browser to start using the application.