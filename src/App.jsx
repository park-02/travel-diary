import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import TravelForm from "./components/TravelForm";
import TravelList from "./components/TravelList";

export default function App() {
  const [travels, setTravels] = useState(() => {
    const saved = localStorage.getItem('travels')
    if (saved) {
      return JSON.parse(saved);
    }

    return [];
  })

  const [editingTravel, setEditingTravel] = useState(null);

  // travels 변경 -> localStorage 저장
  useEffect(() => {
    localStorage.setItem('travels', JSON.stringify(travels))
  }, [travels])

  const handleAdd = (newTravel) => {
    setTravels([...travels, newTravel])
  }

  const handleUpdate = (updatedTravel) => {
    setTravels(travels.map(t =>
      t.id === updatedTravel.id ? updatedTravel : t
    ))

    setEditingTravel(null)
  }

  // 여행지 삭제
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setTravels(travels.filter(t => t.id !== id)) // id 다른 것만 남김
    }
  }

  // 수정 시작
  const handleEdit = (travel) => {
    setEditingTravel(travel)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingTravel(null)
  }

  // 통계 계산 - 총 국가 수
  const totalCountries = new Set(travels.map(t => t.country)).size

  return (
    <div className="App">
      <Header
        totalTrips={travels.length}
        totalCountries={totalCountries}
      />

      <TravelForm
        onAdd={handleAdd}
        editingTravel={editingTravel}
        onUpdate={handleUpdate}
        onCancelEdit={handleCancelEdit}
      />
      <TravelList
        travels={travels}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
