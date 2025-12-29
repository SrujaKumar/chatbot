import ChatApp from "./ChatApp";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

function ChatRouteWrapper() {
    const location = useLocation();
    const isChatRoute = location.pathname.match(/^\/chat\d+$/);
    
    if (isChatRoute) {
        return <ChatApp />;
    }
    
    return <div>Not Found</div>;
}

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
