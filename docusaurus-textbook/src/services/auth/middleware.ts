
// This middleware is for API routes and works with the request/response pattern
// In Docusaurus, API routes are handled differently than in Next.js
// This is a server-side function that can be used in API routes

// Utility function to check if user has access to a specific resource
export const checkUserAccess = (session: any, requiredPermissions?: string[]) => {
  if (!session) {
    return false;
  }

  // Add any additional permission checks here
  // For now, just check if user is authenticated
  return true;
};

// Function to get session from request (using backend auth API)
export const getSessionFromRequest = async (req: any) => {
  try {
    // Get session from request using backend auth API
    // This assumes the request has an Authorization header with Bearer token
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const response = await fetch(`${process.env.CHAT_API_URL || 'http://localhost:8000'}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const userData = await response.json();
      return userData; // Return user data as session equivalent
    }
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Function to protect API routes (using backend auth API)
export const protectApiRoute = async (req: any, res: any) => {
  try {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        authenticated: false,
        error: 'Unauthorized',
        message: 'Please sign in to access this resource'
      });
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const response = await fetch(`${process.env.CHAT_API_URL || 'http://localhost:8000'}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const userData = await response.json();
      return userData; // Return user data as session equivalent
    }

    res.status(401).json({
      authenticated: false,
      error: 'Unauthorized',
      message: 'Please sign in to access this resource'
    });
    return null;
  } catch (error) {
    console.error('Auth protection error:', error);
    res.status(401).json({
      authenticated: false,
      error: 'Unauthorized'
    });
    return null;
  }
};
