import TravelCard from './TravelCard'

export default function TravelList({ travels, onEdit, onDelete }) {
    if (travels.length === 0) { // travels에 아무것도 없으면 아래 텍스트 출력
        return (
            <div className="empty-state">
                <p>🌎</p>
                <p>아직 여행 기록이 없습니다.</p>
                <p>첫 번째 여행지를 추가해보세요!</p>
            </div>
        )
    }

    return (
        <div className="travel-list">
            {travels.map((travel) => (
                <TravelCard
                    key={travel.id}
                    travel={travel}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}

// App.jsx의 travels, onEdit, onDelete