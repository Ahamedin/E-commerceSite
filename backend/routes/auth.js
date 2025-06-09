import express from 'express';
import passport from 'passport';

const router = express.Router();

// Start OAuth with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback handler
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login', // redirect to login page on failure
    session: true,              // maintain session after login 
  }),
  (req, res) => {
    // Redirect to frontend after successful login
    // You can redirect to any page you want here, for example, the homepage or dashboard
    res.redirect('http://localhost:5000/'); // Replace with your frontend URL
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/'); // Redirect to the home page after logging out
  });
});

// Send logged-in user info to frontend
router.get('/user', (req, res) => {
  res.json(req.user || null); // Return user object (or null if not authenticated)
});

export default router;
