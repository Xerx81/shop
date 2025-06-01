import { BrowserRouter, Route, Routes } from "react-router-dom";
import List from "./pages/List";
import Item from "./pages/Item";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<List />} />
                <Route path="/:id" element={<Item />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
