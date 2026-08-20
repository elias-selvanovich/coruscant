import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Catalog } from './pages/Catalog'
import { ItemDetail } from './pages/ItemDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
