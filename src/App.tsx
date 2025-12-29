import ChatApp from "./ChatApp";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

/**
 * Wrapper component that validates chat routes using regex pattern.
 * Matches URLs like /chat1, /chat2, /chat3, etc.
 */
function ChatRouteWrapper() {
    const location = useLocation();
    // Match /chat followed by one or more digits
    const isChatRoute = location.pathname.match(/^\/chat\d+$/);
    
    if (isChatRoute) {
        return <ChatApp />;
    }
    
    return <div>Not Found</div>;
}

/**
 * Root application component with routing configuration.
 * Routes:
 * - / : Redirects to /chat1
 * - /chat{id} : Renders ChatApp for valid chat IDs
 * - * : Shows "Not Found" for invalid routes
 */
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/chat1" replace />} />
                <Route path="*" element={<ChatRouteWrapper />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
