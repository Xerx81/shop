import { BrowserRouter, Route, Routes } from "react-router-dom";
import List from "./pages/List";
import Item from "./pages/Item";
import Auth from "./pages/Auth";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<List />} />
                <Route path="/:id" element={<Item />} />
                <Route path="/auth" element={<Auth />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
