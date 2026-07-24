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

    return [
      {
        id: 1,
        name: '에펠탑',
        country: '프랑스',
        city: '파리',
        date: '2024-07-15',
        image: 'https://media.triple.guide/triple-cms/c_limit,f_auto,h_1024,w_1024/953697b8-a36d-43e3-8dad-ee22eb3a3dea.jpeg',
        rating: 5,
        memo: '정말 아름다웠어요! 야경이 최고였습니다.',
        createdAt: '2024-07-20T10:30:00'
      },
      {
        id: 2,
        name: '도쿄 타워',
        country: '일본',
        city: '도쿄',
        date: '2024-08-10',
        image: 'https://cdn.imweb.me/upload/S201805105af3b93f645c8/ace9a84df341f.jpg',
        rating: 4,
        memo: '도쿄의 상징! 전망이 정말 좋았어요.',
        createdAt: '2024-08-15T14:20:00'
      },
      {
        id: 3,
        name: '콜로세움',
        country: '이탈리아',
        city: '로마',
        date: '2024-09-05',
        image: 'https://i.namu.wiki/i/mecLdrbH6SANsAVoqJGrYR5XK31DY_6mMbGzSvM_FSrx5DgY9r7HhztOlvH85ecjWalmq08oyzSh2KWGYnAQag.webp',
        rating: 5,
        memo: '역사의 무게가 느껴지는 곳이었습니다.',
        createdAt: '2024-09-10T09:15:00'
      }
    ]
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
